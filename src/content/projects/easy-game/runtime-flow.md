# easy_game 运行流程

## 核心状态模型

`GameState.py` 集中定义全局状态，运行时各个节点都接收并返回一个新的 `GameState`。主要状态分区包括：

- `plot`：章节、场景、主线目标、大纲、修为阶段和章节归档。
- `scene`：地点、时间、当前 beat、张力、在场角色和焦点角色。
- `characters`：角色情绪、意图、已知事实、关系增量和角色记忆。
- `history`：已经发生的事件、发言和系统旁白。
- `runtime`：回合计数、下一步行动、旁白队列和结束状态。
- `scene_plan`：当前场景目标、必须发生或不能发生的事项、戏剧曲线和退出条件。
- `director_brief`：导演节点给出的调度建议、开场/收束文本和舞台动作。
- `memory`：压缩后的场景记忆、编剧记忆、导演记忆和调度记忆。
- `player`：玩家控制角色、最后输入和解析后的玩家行动。

这种结构让每个节点只更新自己关心的状态片段，降低模块之间的耦合，也方便针对单个节点写测试。

## Graph 编排

主流程入口在 `Graph.builder`。它把项目拆成几个子图：

- `build_story_authoring_subgraph`：生成故事前提、章节大纲、角色阵容，并在角色生成后修订大纲。
- `build_story_setup_subgraph`：执行故事创作，并生成开场旁白。
- `build_chapter_preparation_subgraph`：扩展章节、准备章节/场景开场、刷新记忆和生成场景候选。
- `build_scene_direction_subgraph`：更新导演 brief，再由调度器选择下一位行动者。
- `build_chapter_runtime_subgraph`：串起章节准备、场景调度、beat 执行和转场。
- `build_game_graph`：把故事设置和章节运行接成完整游戏图。

`Graph.graph_compile` 会优先使用 `langgraph` 的 `StateGraph` 编译节点；在缺少 `langgraph` 的情况下，部分流程也能通过本地 runner 按顺序执行。

## 一轮故事推进

典型流程从 `session_bootstrap` 创建初始状态和运行依赖开始：

1. 创建默认玩家角色档案。
2. 创建初始场景配置。
3. 生成 `GameState`。
4. 创建 `GraphDependencies`，注入 Agent、策略、历史管理器和玩家接口。
5. 生成故事前提、大纲、角色阵容和开场旁白。
6. 扩展当前章节，准备场景候选和章节开场。
7. 由导演节点更新舞台状态。
8. 由调度器选择下一位行动者。
9. 如果轮到玩家，解析玩家输入并生成 `ResolvedAct`。
10. 如果轮到 NPC，按角色类型选择对应 Actor Agent 或启发式行动。
11. 将行动写入历史、关系、情绪和记忆。
12. 生成旁白，刷新历史记忆，判断场景或章节是否结束。
13. 在场景结束时进入场景转场，在章节结束时归档并推进到下一章。

## Agent 与兜底逻辑

Agent 构造集中在 `ComponentFactory.py`，运行依赖集中在 `GraphDependencies`。项目中的 Agent 覆盖故事规划、角色创建、导演调度、角色行动、玩家语义解析、旁白生成、文本润色和历史摘要。

如果使用 `heuristic` 模式，项目会用本地规则生成剧情片段、角色行动、场景结束判断和玩家输入解析。这样即使没有模型服务，也可以验证主流程、状态更新和测试用例。
