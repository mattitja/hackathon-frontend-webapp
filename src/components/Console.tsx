import { createSignal } from "solid-js";
import { useGame } from "../contexts/game";

export const Console = () => {
  const {
    messages,
    state,
  } = useGame();
  const states = ["Connecting", "Connected", "Disconnecting", "Disconnected"];
  return (
    <section id="connection">
      <div>
        <p>
          Websocket-Connection:{" "}
          <span style="color: #AAFF00"> {states[state()]}</span>
        </p>
      </div>
      <div class="console">
        {messages()
          .map((event: string, index: string) => {
            const eventType =
              JSON.parse(event).eventType != undefined
                ? JSON.parse(event).eventType
                : "ConnectionEvent";
            return (
              <ConsoleLog
                key={index}
                title={index + ": " + eventType}
                data={event}
              />
            );
          })
          .reverse()}
      </div>
    </section>
  );
};

const ConsoleLog = (props) => {
  const [collapsed, setCollapsed] = createSignal(true);

  const toggleCollapse = () => setCollapsed(!collapsed());

  return (
    <div class="log-entry">
      <div class="log-header" onClick={toggleCollapse}>
        {props.title}
      </div>
      {!collapsed() && <div class="log-details">{props.data}</div>}
    </div>
  );
};
