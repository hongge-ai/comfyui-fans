import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  INITIAL_CONNECTIONS,
  INITIAL_POSITIONS,
  INITIAL_VALUES,
  NODES,
  PARAM_INFO,
  PORT_TYPES,
} from './workflowData';
import './styles.css';

const RUN_ORDER = ['checkpoint', 'positive', 'negative', 'latent', 'sampler', 'vae', 'save'];

function Field({id, label, children, onSelect}) {
  return (
    <div className="iw-field" onClick={(event) => {event.stopPropagation(); onSelect(id);}}>
      <label htmlFor={`iw-${id}`}>{label}</label>
      {children}
    </div>
  );
}

export default function InteractiveWorkflow() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [positions, setPositions] = useState(INITIAL_POSITIONS);
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  const [selectedNode, setSelectedNode] = useState('sampler');
  const [selectedParam, setSelectedParam] = useState('steps');
  const [selectedPort, setSelectedPort] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [pendingPort, setPendingPort] = useState(null);
  const [view, setView] = useState({x: 12, y: 12, scale: 0.62});
  const [runState, setRunState] = useState('idle');
  const [activeNode, setActiveNode] = useState(null);
  const [notice, setNotice] = useState('点击节点或参数查看讲解，也可以拖动节点重新布局。');
  const viewportRef = useRef(null);
  const gestureRef = useRef(null);

  const nodeMap = useMemo(() => Object.fromEntries(NODES.map((node) => [node.id, node])), []);
  const currentNode = nodeMap[selectedNode];
  const currentParam = selectedParam ? PARAM_INFO[selectedParam] : null;
  const currentEdge = selectedEdge ? connections.find((edge) => edge.id === selectedEdge) : null;

  const updateValue = (id, value) => {
    setValues((old) => ({...old, [id]: value}));
    setSelectedParam(id);
    setSelectedPort(null);
    setSelectedEdge(null);
    setSelectedNode(PARAM_INFO[id].node);
    setRunState('idle');
  };

  const selectNode = (id) => {
    setSelectedNode(id);
    setSelectedParam(null);
    setSelectedPort(null);
    setSelectedEdge(null);
  };

  const selectParam = (id) => {
    setSelectedParam(id);
    setSelectedNode(PARAM_INFO[id].node);
    setSelectedPort(null);
    setSelectedEdge(null);
  };

  const fitView = () => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scale = Math.min((rect.width - 24) / 1200, (rect.height - 24) / 680, 1);
    setView({x: 12, y: 12, scale: Math.max(scale, 0.25)});
  };

  useEffect(() => {
    fitView();
    window.addEventListener('resize', fitView);
    return () => window.removeEventListener('resize', fitView);
  }, []);

  useEffect(() => {
    if (runState !== 'running') return undefined;
    let index = 0;
    setActiveNode(RUN_ORDER[0]);
    const timer = window.setInterval(() => {
      index += 1;
      if (index >= RUN_ORDER.length) {
        window.clearInterval(timer);
        setActiveNode(null);
        setRunState('done');
        setNotice(`模拟完成：${values.prefix}_00001_.png · ${values.width}×${values.height} · ${values.steps} steps`);
        if (values.seedMode === 'increment') updateValue('seed', Number(values.seed) + 1);
        if (values.seedMode === 'decrement') updateValue('seed', Number(values.seed) - 1);
        return;
      }
      setActiveNode(RUN_ORDER[index]);
      setSelectedNode(RUN_ORDER[index]);
    }, 650);
    return () => window.clearInterval(timer);
  }, [runState]);

  const resetWorkflow = () => {
    setValues(INITIAL_VALUES);
    setPositions(INITIAL_POSITIONS);
    setConnections(INITIAL_CONNECTIONS);
    setSelectedNode('sampler');
    setSelectedParam('steps');
    setSelectedPort(null);
    setSelectedEdge(null);
    setPendingPort(null);
    setRunState('idle');
    setActiveNode(null);
    setNotice('已恢复 SD1.5 示例工作流。');
    fitView();
  };

  const startGesture = (event, kind, id) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    if (kind === 'node') selectNode(id);
    gestureRef.current = {
      kind, id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      origin: kind === 'node' ? positions[id] : {x: view.x, y: view.y},
    };
    viewportRef.current?.setPointerCapture(event.pointerId);
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

  const zoom = (factor) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setView((old) => {
      const scale = Math.min(1.6, Math.max(0.25, old.scale * factor));
      const ratio = scale / old.scale;
      return {x: centerX - (centerX - old.x) * ratio, y: centerY - (centerY - old.y) * ratio, scale};
    });
  };

  const handleWheel = (event) => {
    event.preventDefault();
    zoom(event.deltaY > 0 ? 0.9 : 1.1);
  };

  const getPort = (nodeId, portId, direction) => {
    return nodeMap[nodeId][direction === 'output' ? 'outputs' : 'inputs'].find((port) => port.id === portId);
  };

  const clickPort = (event, nodeId, port, direction) => {
    event.stopPropagation();
    setSelectedNode(nodeId);
    setSelectedParam(null);
    setSelectedEdge(null);
    setSelectedPort({nodeId, portId: port.id, direction, type: port.type, label: port.label});
    if (direction === 'output') {
      setPendingPort({nodeId, portId: port.id, type: port.type});
      setNotice(`已选择 ${port.type} 输出，请点击一个同色输入端口完成连线。`);
      return;
    }
    if (!pendingPort) {
      setNotice(`${port.label} 是 ${port.type} 输入。先点击一个同色输出端口，再点击这里即可连线。`);
      return;
    }
    if (pendingPort.type !== port.type) {
      setNotice(`类型不匹配：${pendingPort.type} 不能连接到 ${port.type}。`);
      return;
    }
    if (pendingPort.nodeId === nodeId) {
      setNotice('不能把节点连接到自身。');
      return;
    }
    const edge = {
      id: `custom-${Date.now()}`, from: pendingPort.nodeId, fromPort: pendingPort.portId,
      to: nodeId, toPort: port.id, type: port.type,
    };
    setConnections((old) => [...old.filter((item) => !(item.to === nodeId && item.toPort === port.id)), edge]);
    setPendingPort(null);
    setRunState('idle');
    setNotice(`已连接 ${port.type}。点击连线可选中并断开，重置可恢复示例。`);
  };

  const portPoint = (nodeId, portId, direction) => {
    const node = nodeMap[nodeId];
    const port = getPort(nodeId, portId, direction);
    return {
      x: positions[nodeId].x + (direction === 'output' ? node.width : 0),
      y: positions[nodeId].y + port.top,
    };
  };

  const runWorkflow = () => {
    const missing = NODES.flatMap((node) => node.inputs.filter((port) =>
      !connections.some((edge) => edge.to === node.id && edge.toPort === port.id)
    ).map((port) => `${node.title}.${port.id}`));
    if (missing.length) {
      setNotice(`无法执行：缺少输入 ${missing.join('、')}。请重新连线或重置工作流。`);
      return;
    }
    setSelectedParam(null);
    setSelectedPort(null);
    setSelectedEdge(null);
    setPendingPort(null);
    if (values.seedMode === 'randomize') {
      setValues((old) => ({...old, seed: Math.floor(Math.random() * 1000000000)}));
    }
    setNotice('正在按依赖顺序模拟执行；这是教学演示，不会调用模型或生成真实图片。');
    setRunState('running');
  };

  const renderNodeFields = (node) => {
    if (node.id === 'checkpoint') return (
      <Field id="checkpoint" label="ckpt_name" onSelect={selectParam}>
        <select id="iw-checkpoint" value={values.checkpoint} onChange={(e) => updateValue('checkpoint', e.target.value)}>
          <option>v1-5-pruned-emaonly-fp16.safetensors</option>
          <option>Dreamshaper.safetensors</option>
          <option>Anything-V5.safetensors</option>
        </select>
      </Field>
    );
    if (node.id === 'positive' || node.id === 'negative') return (
      <Field id={node.id} label="text" onSelect={selectParam}>
        <textarea id={`iw-${node.id}`} rows="4" value={values[node.id]} onChange={(e) => updateValue(node.id, e.target.value)} />
      </Field>
    );
    if (node.id === 'latent') return (
      <div className="iw-latent-fields">
        {['width', 'height', 'batch'].map((id) => (
          <Field key={id} id={id} label={{width: 'width', height: 'height', batch: 'batch_size'}[id]} onSelect={selectParam}>
            <input id={`iw-${id}`} type="number" min="1" step={id === 'batch' ? 1 : 8} value={values[id]} onChange={(e) => updateValue(id, Number(e.target.value))} />
          </Field>
        ))}
      </div>
    );
    if (node.id === 'save') return (
      <Field id="prefix" label="filename_prefix" onSelect={selectParam}>
        <input id="iw-prefix" type="text" value={values.prefix} onChange={(e) => updateValue('prefix', e.target.value)} />
      </Field>
    );
    if (node.id !== 'sampler') return <div className="iw-no-params">选择端口，查看数据如何流入和流出。</div>;
    return (
      <div className="iw-sampler-fields">
        <div className="iw-seed-row">
          <Field id="seed" label="seed" onSelect={selectParam}>
            <input id="iw-seed" type="number" min="0" value={values.seed} onChange={(e) => updateValue('seed', Number(e.target.value))} />
          </Field>
          <Field id="seedMode" label="模式" onSelect={selectParam}>
            <select id="iw-seedMode" value={values.seedMode} onChange={(e) => updateValue('seedMode', e.target.value)}>
              <option value="fixed">fixed</option><option value="increment">increment</option>
              <option value="decrement">decrement</option><option value="randomize">randomize</option>
            </select>
          </Field>
        </div>
        {[
          ['steps', 'steps', 1, 100, 1],
          ['cfg', 'cfg', 1, 20, 0.5],
          ['denoise', 'denoise', 0, 1, 0.01],
        ].map(([id, label, min, max, step]) => (
          <Field key={id} id={id} label={`${label} · ${values[id]}`} onSelect={selectParam}>
            <input id={`iw-${id}`} type="range" min={min} max={max} step={step} value={values[id]} onChange={(e) => updateValue(id, Number(e.target.value))} />
          </Field>
        ))}
        <Field id="sampler" label="sampler_name" onSelect={selectParam}>
          <select id="iw-sampler" value={values.sampler} onChange={(e) => updateValue('sampler', e.target.value)}>
            <option>euler</option><option>euler_ancestral</option><option>dpmpp_2m</option><option>dpmpp_2m_sde</option><option>ddim</option>
          </select>
        </Field>
        <Field id="scheduler" label="scheduler" onSelect={selectParam}>
          <select id="iw-scheduler" value={values.scheduler} onChange={(e) => updateValue('scheduler', e.target.value)}>
            <option>normal</option><option>karras</option><option>exponential</option><option>sgm_uniform</option><option>simple</option>
          </select>
        </Field>
      </div>
    );
  };

  return (
    <section className="iw-shell" aria-label="可交互 ComfyUI 文生图工作流">
      <div className="iw-toolbar">
        <div><strong>交互实验室</strong><span>SD1.5 · 文生图</span></div>
        <div className="iw-toolbar-actions">
          <button type="button" onClick={() => zoom(0.85)} aria-label="缩小">−</button>
          <button type="button" className="iw-zoom-value" onClick={fitView}>{Math.round(view.scale * 100)}%</button>
          <button type="button" onClick={() => zoom(1.15)} aria-label="放大">+</button>
          <button type="button" onClick={resetWorkflow}>重置</button>
          <button type="button" className="iw-run" onClick={runWorkflow} disabled={runState === 'running'}>
            {runState === 'running' ? '执行中…' : '▶ 模拟运行'}
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="iw-viewport"
        onWheel={handleWheel}
        onPointerDown={(event) => {if (event.target === event.currentTarget) startGesture(event, 'pan');}}
        onPointerMove={moveGesture}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onKeyDown={(event) => {if (event.key === 'Escape') setPendingPort(null);}}
        tabIndex="0"
        aria-label="工作流画布，拖动空白处平移，拖动节点标题移动节点">
        <div className="iw-world" style={{transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`}}>
          <svg className="iw-edges" width="1200" height="680" viewBox="0 0 1200 680" aria-label="节点连线">
            {connections.map((edge) => {
              const start = portPoint(edge.from, edge.fromPort, 'output');
              const end = portPoint(edge.to, edge.toPort, 'input');
              const bend = Math.max(55, Math.abs(end.x - start.x) * 0.45);
              const path = `M ${start.x} ${start.y} C ${start.x + bend} ${start.y}, ${end.x - bend} ${end.y}, ${end.x} ${end.y}`;
              const highlighted = selectedNode === edge.from || selectedNode === edge.to || selectedEdge === edge.id;
              return (
                <g key={edge.id} className={`iw-edge ${highlighted ? 'is-highlighted' : ''}`} onClick={(event) => {event.stopPropagation(); setSelectedEdge(edge.id); setSelectedNode(edge.from); setSelectedParam(null); setSelectedPort(null);}}>
                  <path className="iw-edge-hit" d={path} />
                  <path className="iw-edge-line" d={path} stroke={PORT_TYPES[edge.type].color} />
                </g>
              );
            })}
          </svg>

          {NODES.map((node) => (
            <article
              key={node.id}
              className={`iw-node iw-node-${node.id} ${selectedNode === node.id ? 'is-selected' : ''} ${activeNode === node.id ? 'is-running' : ''}`}
              style={{left: positions[node.id].x, top: positions[node.id].y, width: node.width, height: node.height}}>
              <header className="iw-node-header" onPointerDown={(event) => startGesture(event, 'node', node.id)}>
                <span className="iw-node-letter">{node.letter}</span>
                <span><strong>{node.title}</strong><small>{node.subtitle}</small></span>
              </header>
              <div className="iw-node-body" onClick={() => selectNode(node.id)}>
                {renderNodeFields(node)}
              </div>
              {node.inputs.map((port) => (
                <button
                  key={port.id} type="button" className={`iw-port iw-port-input ${pendingPort?.type === port.type ? 'is-compatible' : ''}`}
                  style={{top: port.top, '--port-color': PORT_TYPES[port.type].color}}
                  onClick={(event) => clickPort(event, node.id, port, 'input')}
                  title={`${port.label} 输入 · 点击查看讲解`} aria-label={`${node.title} ${port.label} 输入`}>
                  <i /> <span>{port.label}</span>
                </button>
              ))}
              {node.outputs.map((port) => (
                <button
                  key={port.id} type="button" className={`iw-port iw-port-output ${pendingPort?.nodeId === node.id && pendingPort?.portId === port.id ? 'is-pending' : ''}`}
                  style={{top: port.top, '--port-color': PORT_TYPES[port.type].color}}
                  onClick={(event) => clickPort(event, node.id, port, 'output')}
                  title={`${port.label} 输出 · 点击后开始连线`} aria-label={`${node.title} ${port.label} 输出`}>
                  <span>{port.label}</span><i />
                </button>
              ))}
            </article>
          ))}
        </div>
        <div className="iw-canvas-hint">拖动空白处平移 · 滚轮缩放 · 输出 → 同色输入可连线</div>
      </div>

      <div className="iw-notice" role="status"><span className={runState === 'running' ? 'iw-pulse' : ''} />{notice}</div>

      <div className="iw-learning-panel">
        <nav className="iw-node-tabs" aria-label="选择要学习的节点">
          {NODES.map((node) => <button key={node.id} type="button" className={selectedNode === node.id ? 'is-active' : ''} onClick={() => selectNode(node.id)}>{node.letter}. {node.subtitle}</button>)}
        </nav>
        <div className="iw-explanation">
          <div className="iw-explanation-heading">
            <span>{currentNode.letter}</span>
            <div><strong>{currentNode.title}</strong><small>{currentNode.subtitle}</small></div>
          </div>
          <p>{currentNode.summary}</p>
          {currentParam ? (
            <div className="iw-detail">
              <strong>{currentParam.label}</strong>
              <p>{currentParam.description}</p>
              <div className="iw-tip">学习提示：{currentParam.tip}</div>
            </div>
          ) : selectedPort ? (
            <div className="iw-detail">
              <strong style={{color: PORT_TYPES[selectedPort.type].color}}>{selectedPort.label} · {selectedPort.direction === 'input' ? '输入' : '输出'}端口</strong>
              <p>{PORT_TYPES[selectedPort.type].description}</p>
              <div className="iw-tip">只有相同类型的端口才能连接。点击输出，再点击同色输入，可以亲自连一次。</div>
            </div>
          ) : currentEdge ? (
            <div className="iw-detail">
              <strong style={{color: PORT_TYPES[currentEdge.type].color}}>{currentEdge.type} 连线</strong>
              <p>{nodeMap[currentEdge.from].title} → {nodeMap[currentEdge.to].title}。{PORT_TYPES[currentEdge.type].description}</p>
              <button type="button" className="iw-disconnect" onClick={() => {setConnections((old) => old.filter((edge) => edge.id !== currentEdge.id)); setSelectedEdge(null); setRunState('idle'); setNotice('连线已断开；模拟运行会检查所有必需输入。');}}>断开此连线</button>
            </div>
          ) : <div className="iw-tip">学习提示：{currentNode.tip}</div>}
          {selectedNode === 'latent' && <div className="iw-formula">潜空间形状：[{values.batch || 0}, 4, {Math.floor(values.height / 8) || 0}, {Math.floor(values.width / 8) || 0}]</div>}
          {selectedNode === 'save' && <div className="iw-formula">输出文件：{values.prefix || 'ComfyUI'}_00001_.png</div>}
        </div>
      </div>
      <footer className="iw-footer">学习模式：参数与连线可交互，执行过程为模拟演示，不会调用本地 ComfyUI 或生成图片。</footer>
    </section>
  );
}
