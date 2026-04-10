# easy_game 运行与测试

## 运行模式

项目主要支持三种模式：

- `heuristic`：离线启发式模式，适合调试和回归测试。
- `agent-first`：优先调用 LLM Agent，失败时保留部分启发式回退。
- `live`：面向真实模型服务的运行模式。

`agent-first` 和 `live` 依赖 `BaseAgent.py` 中的 OpenAI 兼容 Chat Completions 客户端，需要配置模型服务相关环境变量。

```env
LLM_BASE_URL=...
LLM_API_KEY=...
LLM_MODEL_ID=...
LLM_TIMEOUT_SECONDS=300
```

## 基础依赖

仓库目前没有提交独立的 `requirements.txt`。从代码路径看，基础运行和测试通常需要：

```powershell
python -m pip install python-dotenv openai pytest
```

如果要启用数据库存档：

```powershell
python -m pip install sqlalchemy pymysql
```

如果要使用 `langgraph` 编译完整图：

```powershell
python -m pip install langgraph
```

## 命令行 Demo

启发式模式下运行 3 轮：

```powershell
python demo_run.py --mode heuristic --rounds 3
```

交互式命令行模式：

```powershell
python demo_run.py --mode heuristic --interactive --player-character player
```

## Web Demo

启动浏览器端 Demo：

```powershell
python web_demo.py --mode heuristic --host 127.0.0.1 --port 8000
```

启用数据库存档：

```powershell
python web_demo.py --mode heuristic --database-url "mysql+pymysql://user:pass@host:3306/stagebound"
```

Web 会话由 `web_session.WebGameSession` 维护。玩家提交动作后，它会自动推进 NPC 行动，直到轮到玩家或场景结束；如果玩家输入像工具请求，就交给 `PlayerCommandToolRuntime` 执行，并把结果写入历史。

## 工具系统

工具定义集中在 `ToolSkillRegistry.py`，说明文本放在 `skills/`。当前内置能力包括：

- 查询背包：`query_inventory`
- 查询玩家状态：`query_player_status`
- 查询角色关系：`query_relation`
- 查询任务：`query_quests`
- 手动存档/读档：`save_checkpoint` / `load_checkpoint`
- 给故事 Agent 使用的场景、记忆和角色名单查询

## 测试覆盖

测试集中在 `tests/`，覆盖角色档案层、beat 执行、上下文场景交接、导演冲突调度、旁白风格、持久化保存读取、玩家工具、故事规划回退、文本格式回归和工具技能注册等路径。

原仓库 README 记录的最近一次本地验证结果为：

```text
82 passed
```
