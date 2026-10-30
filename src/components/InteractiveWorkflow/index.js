import React, {useEffect, useRef, useState} from 'react';
import {
  CLIP_TOKEN_LIMIT,
  INITIAL_CONNECTIONS,
  INITIAL_VALUES,
  NODES,
  PARAM_BY_ID,
  PARAMS,
  PORT_TYPES,
  PRESETS,
  RUN_SEQUENCE,
  TOUR,
  WEIGHT_RULES,
  WORLD,
} from './workflowData';
import './styles.css';

const PORT_START = 46;
const PORT_GAP = 28;
const WIDGET_H = 30;
const WIDGET_GAP = 4;

const TABS = [
  {id: 'tour', label: '导览', hint: '按顺序走一遍'},
  {id: 'node', label: '节点', hint: '每个元件的职责'},
  {id: 'param', label: '参数', hint: '逐项调参'},
  {id: 'prompt', label: '提示词', hint: '写法与权重'},
  {id: 'run', label: '运行', hint: '执行与结果'},
];

const nodeMap = Object.fromEntries(NODES.map((node) => [node.id, node]));
const paramsByNode = Object.fromEntries(NODES.map((node) => [node.id, PARAMS.filter((param) => param.node === node.id)]));

const portTop = (index) => PORT_START + index * PORT_GAP;
const widgetTop = (node) => portTop(Math.max(node.inputs.length, node.outputs.length)) + 10;

function estimateTokens(text) {
  return text.trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .reduce((sum, word) => sum + Math.max(1, Math.ceil((word.replace(/[()[\]:]/g, '').length + 1) / 4)), 0);
}

function zoomedView(old, factor, centerX, centerY) {
  const scale = Math.min(1.6, Math.max(0.25, old.scale * factor));
  const ratio = scale / old.scale;
  return {x: centerX - (centerX - old.x) * ratio, y: centerY - (centerY - old.y) * ratio, scale};
}

function TokenMeter({text}) {
  const count = estimateTokens(text);
  const over = count > CLIP_TOKEN_LIMIT;
  return (
    <div className={`iw-tokens ${over ? 'is-over' : ''}`}>
      <div className="iw-tokens-bar"><i style={{width: `${Math.min(100, (count / CLIP_TOKEN_LIMIT) * 100)}%`}} /></div>
      <span>约 {count} / {CLIP_TOKEN_LIMIT} token</span>
      {over && <em>超过后会被切段编码，后半段效果下降</em>}
    </div>
  );
}

export default function InteractiveWorkflow() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [positions, setPositions] = useState(() => Object.fromEntries(NODES.map((node) => [node.id, {x: node.x, y: node.y}])));
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  const [tab, setTab] = useState('tour');
  const [selection, setSelection] = useState({kind: 'node', id: 'sampler'});
  const [pendingPort, setPendingPort] = useState(null);
  const [tourStep, setTourStep] = useState(0);
  const [view, setView] = useState({x: 12, y: 12, scale: 0.7});
  const [run, setRun] = useState({status: 'idle', step: -1});
  const [notice, setNotice] = useState('拖动节点标题移动节点，拖动空白处平移，滚轮缩放。');
  const viewportRef = useRef(null);
  const gestureRef = useRef(null);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const update = (id, value) => {
    setValues((old) => ({...old, [id]: value}));
    setRun({status: 'idle', step: -1});
  };

  const node = selection.kind === 'node' ? nodeMap[selection.id] : null;
  const param = selection.kind === 'param' ? PARAM_BY_ID[selection.id] : null;
  const edge = selection.kind === 'edge' ? connections.find((item) => item.id === selection.id) : null;
  const port = selection.kind === 'port' ? selection.id : null;

  const focusNode = (id) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    const target = nodeMap[id];
    if (!rect || !target) return;
    setView((old) => {
      const left = old.x + target.x * old.scale;
      const right = left + target.width * old.scale;
      const top = old.y + target.y * old.scale;
      const bottom = top + target.height * old.scale;
      const margin = 16;
      if (left >= margin && right <= rect.width - margin && top >= margin && bottom <= rect.height - margin) return old;
      const scale = Math.max(old.scale, 0.62);
      return {
        x: rect.width / 2 - (target.x + target.width / 2) * scale,
        y: rect.height / 2 - (target.y + target.height / 2) * scale,
        scale,
      };
    });
  };

  const fitView = () => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const fitted = Math.min((rect.width - 24) / WORLD.width, (rect.height - 24) / WORLD.height, 1);
    // 窄屏整图适配后字会小到看不清，保留可读下限，超出的部分靠拖动查看
    const scale = rect.width < 700 ? Math.max(0.5, fitted) : Math.max(0.25, fitted);
    setView({x: (rect.width - WORLD.width * scale) / 2, y: 12, scale});
  };

  useEffect(() => {
    fitView();
    window.addEventListener('resize', fitView);
    return () => window.removeEventListener('resize', fitView);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const onWheel = (event) => {
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      setView((old) => zoomedView(old, event.deltaY > 0 ? 0.9 : 1.1, rect.width / 2, rect.height / 2));
    };
    viewport.addEventListener('wheel', onWheel, {passive: false});
    return () => viewport.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    const target = TOUR[tourStep]?.target;
    if (tab !== 'tour' || !target) return;
    if (target.type === 'node') {
      setSelection({kind: 'node', id: target.id});
      focusNode(target.id);
    }
    if (target.type === 'edge') setSelection({kind: 'edge', id: target.id});
  }, [tourStep, tab]);

  useEffect(() => {
    if (run.status !== 'running') return undefined;
    if (run.step >= RUN_SEQUENCE.length) {
      const chosen = valuesRef.current;
      setNotice(`模拟完成：${chosen.prefix}_00001_.png · ${chosen.width}×${chosen.height} · ${chosen.steps} steps · cfg ${chosen.cfg}`);
      if (chosen.seedMode === 'increment') setValues((old) => ({...old, seed: (Number(old.seed) + 1) % 2 ** 32}));
      if (chosen.seedMode === 'decrement') setValues((old) => ({...old, seed: Math.max(0, Number(old.seed) - 1)}));
      setRun({status: 'done', step: run.step});
      return undefined;
    }
    const timer = window.setTimeout(() => setRun((old) => ({...old, step: old.step + 1})), 560);
    return () => window.clearTimeout(timer);
  }, [run.status, run.step]);

  const zoom = (factor) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    setView((old) => zoomedView(old, factor, rect.width / 2, rect.height / 2));
  };

  const startGesture = (event, kind, id) => {
    if (event.button !== 0) return;
    event.preventDefault();
    if (kind === 'node') setSelection({kind: 'node', id});
    gestureRef.current = {
      kind, id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      origin: kind === 'node' ? positions[id] : {x: view.x, y: view.y},
    };
    viewportRef.current.setPointerCapture(event.pointerId);
  };

  const moveGesture = (event) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (gesture.kind === 'node') {
      setPositions((old) => ({
        ...old,
        [gesture.id]: {
          x: Math.round(gesture.origin.x + dx / view.scale),
          y: Math.round(gesture.origin.y + dy / view.scale),
        },
      }));
    } else {
      setView((old) => ({...old, x: gesture.origin.x + dx, y: gesture.origin.y + dy}));
    }
  };

  const endGesture = (event) => {
    if (gestureRef.current?.pointerId === event.pointerId) gestureRef.current = null;
  };

  const getPort = (nodeId, portId, direction) => nodeMap[nodeId][direction === 'output' ? 'outputs' : 'inputs'].find((item) => item.id === portId);

  const portPoint = (nodeId, portId, direction) => {
    const target = nodeMap[nodeId];
    const index = target[direction === 'output' ? 'outputs' : 'inputs'].findIndex((item) => item.id === portId);
    return {
      x: positions[nodeId].x + (direction === 'output' ? target.width : 0),
      y: positions[nodeId].y + portTop(index),
    };
  };

  const clickPort = (event, nodeId, item, direction) => {
    event.stopPropagation();
    setSelection({kind: 'port', id: {nodeId, port: item, direction}});
    setTab('node');
    if (direction === 'output') {
      setPendingPort({nodeId, portId: item.id, type: item.type});
      setNotice(`已选中 ${item.type} 输出，点一个同色输入完成连线。`);
      return;
    }
    if (!pendingPort) {
      setNotice(`${item.label} 是 ${item.type} 输入。先点一个同色输出，再点这里。`);
      return;
    }
    if (pendingPort.type !== item.type) {
      setNotice(`类型不匹配：${pendingPort.type} 接不到 ${item.type}。`);
      return;
    }
    if (pendingPort.nodeId === nodeId) {
      setNotice('不能把节点连到自己。');
      return;
    }
    setConnections((old) => [
      ...old.filter((edgeItem) => !(edgeItem.to === nodeId && edgeItem.toPort === item.id)),
      {id: `custom-${Date.now()}`, from: pendingPort.nodeId, fromPort: pendingPort.portId, to: nodeId, toPort: item.id, type: item.type},
    ]);
    setPendingPort(null);
    setRun({status: 'idle', step: -1});
    setNotice(`已连接 ${item.type}。点连线可选中并断开，重置可恢复示例。`);
  };

  const missingInputs = () => NODES.flatMap((item) => item.inputs
    .filter((input) => !connections.some((edgeItem) => edgeItem.to === item.id && edgeItem.toPort === input.id))
    .map((input) => `${item.title} 的 ${input.label}`));

  const startRun = () => {
    const missing = missingInputs();
    if (missing.length) {
      setNotice(`无法执行：缺少 ${missing.join('、')}。`);
      setTab('run');
      return;
    }
    setPendingPort(null);
    setTourStep(-1);
    fitView();
    if (valuesRef.current.seedMode === 'randomize') {
      setValues((old) => ({...old, seed: Math.floor(Math.random() * 4294967296)}));
    }
    setTab('run');
    setNotice('模拟执行中：按依赖顺序点亮节点，不会真的调用模型。');
    setRun({status: 'running', step: 0});
  };

  const reset = () => {
    setValues(INITIAL_VALUES);
    setPositions(Object.fromEntries(NODES.map((item) => [item.id, {x: item.x, y: item.y}])));
    setConnections(INITIAL_CONNECTIONS);
    setSelection({kind: 'node', id: 'sampler'});
    setPendingPort(null);
    setRun({status: 'idle', step: -1});
    setTourStep(0);
    setTab('tour');
    setNotice('已恢复到示例工作流。');
    fitView();
  };

  const activeNode = run.status === 'running' ? RUN_SEQUENCE[run.step]?.node : null;
  const forwardPasses = (Number(values.steps) || 0) * (Number(values.cfg) > 1 ? 2 : 1);
  const latentW = Math.floor(values.width / 8);
  const latentH = Math.floor(values.height / 8);
  const overSize = values.width !== latentW * 8 || values.height !== latentH * 8;

  const renderWidget = (definition) => {
    const value = values[definition.id];
    const display = definition.kind === 'textarea'
      ? (value || '（空）').slice(0, 96)
      : definition.kind === 'number' && definition.unit ? `${value} ${definition.unit}` : value;
    return (
      <button
        key={definition.id}
        type="button"
        className={`iw-widget ${selection.kind === 'param' && selection.id === definition.id ? 'is-active' : ''}`}
        style={{top: widgetTop(nodeMap[definition.node]) + paramsByNode[definition.node].indexOf(definition) * (WIDGET_H + WIDGET_GAP)}}
        onClick={(event) => {event.stopPropagation(); setSelection({kind: 'param', id: definition.id}); setTab('param');}}
      >
        <span>{definition.label}</span>
        <b className={definition.kind === 'textarea' ? 'is-text' : ''}>{display}</b>
      </button>
    );
  };

  const renderParamEditor = (definition) => {
    const value = values[definition.id];
    if (definition.kind === 'select') {
      return (
        <select value={value} onChange={(event) => update(definition.id, event.target.value)}>
          {definition.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      );
    }
    if (definition.kind === 'textarea') {
      return <textarea rows="4" value={value} onChange={(event) => update(definition.id, event.target.value)} />;
    }
    if (definition.kind === 'number') {
      return (
        <input
          type="number" value={value} min={definition.min} max={definition.max} step={definition.step}
          onChange={(event) => update(definition.id, Number(event.target.value))}
        />
      );
    }
    if (definition.kind === 'text') {
      return <input type="text" value={value} onChange={(event) => update(definition.id, event.target.value)} />;
    }
    return (
      <div className="iw-range">
        <input
          type="range" value={value} min={definition.min} max={definition.max} step={definition.step}
          onChange={(event) => update(definition.id, Number(event.target.value))}
        />
        <input
          type="number" className="iw-range-value" value={value} min={definition.min} max={definition.max} step={definition.step}
          onChange={(event) => update(definition.id, Number(event.target.value))}
        />
      </div>
    );
  };

  const paramDetail = (definition) => (
    <div className="iw-param-detail" key={definition.id}>
      <div className="iw-param-head">
        <strong>{definition.label}</strong>
        <code>{definition.id}</code>
        {definition.id in INITIAL_VALUES && values[definition.id] !== INITIAL_VALUES[definition.id] && <i>已修改</i>}
      </div>
      {renderParamEditor(definition)}
      <p>{definition.description}</p>
      <div className="iw-tip">{definition.tip}</div>
    </div>
  );

  return (
    <section className="iw-shell" aria-label="可交互 ComfyUI 文生图工作流">
      <div className="iw-chrome">
        <div className="iw-chrome-tabs">
          <span className="is-active">工作流</span>
          <span>队列 {run.status === 'done' ? 1 : 0}</span>
          <span>节点库</span>
        </div>
        <div className="iw-chrome-right">
          <span className="iw-chip-zoom">缩放 {Math.round(view.scale * 100)}%</span>
          <button type="button" className="iw-chrome-button" onClick={startRun} disabled={run.status === 'running'}>
            {run.status === 'running' ? '执行中…' : '▶ 队列执行'}
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="iw-viewport"
        onPointerDown={(event) => {if (event.target === event.currentTarget) startGesture(event, 'pan');}}
        onPointerMove={moveGesture}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onKeyDown={(event) => {if (event.key === 'Escape') setPendingPort(null);}}
        tabIndex="0"
      >
        <div className="iw-world" style={{transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, width: WORLD.width, height: WORLD.height}}>
          <svg className="iw-edges" width={WORLD.width} height={WORLD.height} viewBox={`0 0 ${WORLD.width} ${WORLD.height}`}>
            {connections.map((edgeItem) => {
              const start = portPoint(edgeItem.from, edgeItem.fromPort, 'output');
              const end = portPoint(edgeItem.to, edgeItem.toPort, 'input');
              const bend = Math.max(50, Math.abs(end.x - start.x) * 0.42);
              const path = `M ${start.x} ${start.y} C ${start.x + bend} ${start.y}, ${end.x - bend} ${end.y}, ${end.x} ${end.y}`;
              const selected = selection.kind === 'edge' && selection.id === edgeItem.id;
              const tourEdge = tab === 'tour' && TOUR[tourStep]?.target.type === 'edge' && TOUR[tourStep].target.id === edgeItem.id;
              const flowing = activeNode && (edgeItem.from === activeNode || edgeItem.to === activeNode);
              return (
                <g
                  key={edgeItem.id}
                  className={`iw-edge ${selected ? 'is-selected' : ''} ${tourEdge ? 'is-tour' : ''} ${flowing ? 'is-flowing' : ''}`}
                  onClick={(event) => {event.stopPropagation(); setSelection({kind: 'edge', id: edgeItem.id}); setTab('node');}}
                >
                  <path className="iw-edge-hit" d={path} />
                  <path className="iw-edge-line" d={path} stroke={PORT_TYPES[edgeItem.type].color} />
                </g>
              );
            })}
          </svg>

          {NODES.map((item) => {
            const widgets = paramsByNode[item.id];
            const tourNode = tab === 'tour' && TOUR[tourStep]?.target.type === 'node' && TOUR[tourStep].target.id === item.id;
            return (
              <article
                key={item.id}
                className={`iw-node iw-node-${item.id} ${selection.kind === 'node' && selection.id === item.id ? 'is-selected' : ''} ${activeNode === item.id ? 'is-running' : ''} ${tourNode ? 'is-tour' : ''} ${run.status === 'running' && RUN_SEQUENCE.slice(0, run.step).some((entry) => entry.node === item.id) ? 'is-done' : ''}`}
                style={{left: positions[item.id].x, top: positions[item.id].y, width: item.width, height: item.height}}
                onClick={() => {setSelection({kind: 'node', id: item.id}); setTab('node');}}
              >
                <header className="iw-node-header" onPointerDown={(event) => startGesture(event, 'node', item.id)}>
                  <span className="iw-node-letter">{item.letter}</span>
                  <span><strong>{item.title}</strong><small>{item.subtitle}</small></span>
                </header>

                {item.inputs.map((input, index) => (
                  <button
                    key={input.id} type="button"
                    className={`iw-port iw-port-input ${pendingPort?.type === input.type ? 'is-compatible' : ''}`}
                    style={{top: portTop(index), '--port-color': PORT_TYPES[input.type].color}}
                    onClick={(event) => clickPort(event, item.id, input, 'input')}
                    title={input.label}
                  >
                    <i />
                    <span>{input.label}</span>
                  </button>
                ))}
                {item.outputs.map((output, index) => (
                  <button
                    key={output.id} type="button"
                    className={`iw-port iw-port-output ${pendingPort?.nodeId === item.id && pendingPort?.portId === output.id ? 'is-pending' : ''}`}
                    style={{top: portTop(index), '--port-color': PORT_TYPES[output.type].color}}
                    onClick={(event) => clickPort(event, item.id, output, 'output')}
                    title={output.label}
                  >
                    <span>{output.label}</span>
                    <i />
                  </button>
                ))}

                <div className="iw-widgets">
                  {widgets.map(renderWidget)}
                </div>
              </article>
            );
          })}
        </div>

      </div>

      <div className="iw-status" role="status">{notice}</div>

      <div className="iw-dock">
        <nav className="iw-tabs">
          {TABS.map((entry) => (
            <button key={entry.id} type="button" className={tab === entry.id ? 'is-active' : ''} onClick={() => setTab(entry.id)}>
              {entry.label}<small>{entry.hint}</small>
            </button>
          ))}
        </nav>

        <div className="iw-panel">
          {tab === 'tour' && (
            <div className="iw-tour">
              <div className="iw-tour-head">
                <div><strong>{TOUR[tourStep]?.title}</strong><span>第 {tourStep + 1} / {TOUR.length} 步</span></div>
                <div className="iw-tour-nav">
                  <button type="button" onClick={() => setTourStep((step) => Math.max(0, step - 1))} disabled={tourStep === 0}>上一步</button>
                  <button type="button" onClick={() => setTourStep((step) => Math.min(TOUR.length - 1, step + 1))} disabled={tourStep === TOUR.length - 1}>下一步</button>
                </div>
              </div>
              <p>{TOUR[tourStep]?.text}</p>
              <div className="iw-tour-dots">
                {TOUR.map((entry, index) => (
                  <button key={entry.title} type="button" className={index === tourStep ? 'is-active' : ''} onClick={() => setTourStep(index)} title={entry.title} />
                ))}
              </div>
            </div>
          )}

          {tab === 'node' && (
            <div className="iw-node-panel">
              {node && (
                <>
                  <div className="iw-panel-head">
                    <span>{node.letter}</span>
                    <div><strong>{node.title}</strong><small>{node.subtitle}</small></div>
                  </div>
                  <p>{node.summary}</p>
                  <div className="iw-tip">{node.note}</div>
                  <div className="iw-port-list">
                    {node.inputs.map((input) => (
                      <div key={input.id} className={port?.port?.id === input.id ? 'is-active' : ''}>
                        <i style={{background: PORT_TYPES[input.type].color}} />
                        <b>{input.label}</b><span>输入 · {input.detail}</span>
                      </div>
                    ))}
                    {node.outputs.map((output) => (
                      <div key={output.id} className={port?.port?.id === output.id ? 'is-active' : ''}>
                        <i style={{background: PORT_TYPES[output.type].color}} />
                        <b>{output.label}</b><span>输出 · {output.detail}</span>
                      </div>
                    ))}
                    {node.inputs.length + node.outputs.length === 0 && <div><span>这个节点没有连线端口。</span></div>}
                  </div>
                  {paramsByNode[node.id].length > 0 && (
                    <div className="iw-quick-params">
                      {paramsByNode[node.id].map((definition) => (
                        <button key={definition.id} type="button" onClick={() => {setSelection({kind: 'param', id: definition.id}); setTab('param');}}>
                          {definition.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              {edge && (
                <>
                  <div className="iw-panel-head">
                    <span style={{background: PORT_TYPES[edge.type].color}} />
                    <div><strong>{edge.type} 连线</strong><small>{nodeMap[edge.from].title} → {nodeMap[edge.to].title}</small></div>
                  </div>
                  <p>{PORT_TYPES[edge.type].description}</p>
                  <div className="iw-edge-actions">
                    <button type="button" onClick={() => {setConnections((old) => old.filter((item) => item.id !== edge.id)); setSelection({kind: 'node', id: edge.from}); setNotice('连线已断开，模拟运行会指出缺失的输入。');}}>断开此连线</button>
                    <em>断开后点「队列执行」，会看到缺失输入的具体位置。</em>
                  </div>
                </>
              )}
              {!node && !edge && <p className="iw-empty">在画布上点一个节点或连线。</p>}
            </div>
          )}

          {tab === 'param' && (
            <div className="iw-param-panel">
              <div className="iw-param-side">
                {PARAMS.map((definition) => (
                  <button
                    key={definition.id} type="button"
                    className={selection.kind === 'param' && selection.id === definition.id ? 'is-active' : ''}
                    onClick={() => setSelection({kind: 'param', id: definition.id})}
                  >
                    <b>{nodeMap[definition.node].letter}</b>{definition.label}
                  </button>
                ))}
              </div>
              <div className="iw-param-main">
                {param ? paramDetail(param) : (
                  <div className="iw-param-detail">
                    <p>左侧选择一个参数，或在画布上点节点里的数值行。</p>
                    <div className="iw-tip">当前配方：{values.width}×{values.height} · batch {values.batch} · {values.steps} steps · cfg {values.cfg} · {values.sampler} + {values.scheduler} · denoise {values.denoise}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'prompt' && (
            <div className="iw-prompt-panel">
              <div className="iw-prompt-column">
                <label htmlFor="iw-positive">正向提示词</label>
                <textarea id="iw-positive" rows="4" value={values.positive} onChange={(event) => update('positive', event.target.value)} />
                <TokenMeter text={values.positive} />
                <div className="iw-presets">
                  {PRESETS.map((preset) => (
                    <button key={preset.name} type="button" onClick={() => {update('positive', preset.positive); update('negative', preset.negative); setNotice(`已载入预设：${preset.name}`);}}>{preset.name}</button>
                  ))}
                </div>
              </div>
              <div className="iw-prompt-column">
                <label htmlFor="iw-negative">负向提示词</label>
                <textarea id="iw-negative" rows="4" value={values.negative} onChange={(event) => update('negative', event.target.value)} />
                <TokenMeter text={values.negative} />
                <p>负向词靠 cfg 生效：cfg 等于 1 时负向分支被跳过。{values.cfg <= 1 && <b className="iw-warn">当前 cfg 为 {values.cfg}，负向提示词无效。</b>}</p>
              </div>
              <div className="iw-weight-rules">
                <strong>权重写法</strong>
                {WEIGHT_RULES.map(([syntax, meaning]) => (
                  <div key={syntax}><code>{syntax}</code><span>{meaning}</span></div>
                ))}
                <p>权重一般控制在 0.8–1.4，层层套括号容易过饱和、结构崩坏。</p>
              </div>
            </div>
          )}

          {tab === 'run' && (
            <div className="iw-run-panel">
              <div className="iw-run-column">
                <div className="iw-run-head">
                  <button type="button" className="iw-run-button" onClick={startRun} disabled={run.status === 'running'}>
                    {run.status === 'running' ? `执行中 ${Math.min(run.step + 1, RUN_SEQUENCE.length)}/${RUN_SEQUENCE.length}` : '▶ 模拟运行'}
                  </button>
                  <span>{run.status === 'done' ? '已完成一次执行' : run.status === 'running' ? '按依赖顺序点亮节点' : '未执行'}</span>
                </div>
                <ol className="iw-run-log">
                  {RUN_SEQUENCE.map((entry, index) => {
                    const done = run.status !== 'idle' && index < run.step;
                    const active = run.status === 'running' && index === run.step;
                    return (
                      <li key={entry.node} className={active ? 'is-active' : done ? 'is-done' : ''} onClick={() => {setSelection({kind: 'node', id: entry.node}); setTab('node');}}>
                        <i>{nodeMap[entry.node].letter}</i>
                        <div><b>{nodeMap[entry.node].title}</b><span>{entry.text}</span></div>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="iw-run-column">
                <dl className="iw-facts">
                  <div><dt>潜空间形状</dt><dd>[{values.batch}, 4, {latentH}, {latentW}]</dd></div>
                  <div><dt>模型前向次数</dt><dd>{forwardPasses} 次{values.cfg > 1 ? '（cfg>1，正负条件合并成一次 batch）' : '（cfg=1，跳过负向分支）'}</dd></div>
                  <div><dt>输出文件</dt><dd>{values.prefix || 'ComfyUI'}_00001_.png</dd></div>
                  <div><dt>复现条件</dt><dd>{values.seedMode === 'fixed' ? `seed ${values.seed} 会被固定` : `${values.seedMode}：seed 每次都会变`}；还需模型、步数、cfg、采样器、分辨率一致</dd></div>
                  <div><dt>宽高对齐</dt><dd>{overSize ? `会向下取整到 ${latentW * 8}×${latentH * 8}` : '是 8 的倍数'}</dd></div>
                </dl>
                {missingInputs().length > 0 && (
                  <div className="iw-warn">缺少输入：{missingInputs().join('、')}</div>
                )}
                <div className="iw-recipe">
                  {Object.entries({模型: values.checkpoint, 尺寸: `${values.width}×${values.height}`, 批量: values.batch, seed: `${values.seed}（${values.seedMode}）`, steps: values.steps, cfg: values.cfg, 采样器: `${values.sampler} + ${values.scheduler}`, denoise: values.denoise, 前缀: values.prefix}).map(([key, value]) => (
                    <span key={key}><b>{key}</b>{String(value)}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="iw-dock-footer">
          <button type="button" onClick={() => zoom(0.85)}>−</button>
          <button type="button" onClick={fitView}>适应窗口</button>
          <button type="button" onClick={() => zoom(1.15)}>+</button>
          <button type="button" onClick={reset}>重置工作流</button>
          <span>教学演示：不会调用本地 ComfyUI，也不会生成图片。</span>
        </div>
      </div>
    </section>
  );
}
