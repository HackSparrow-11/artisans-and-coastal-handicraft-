import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, CalendarDays, Check, CheckCircle2, Clock3, HeartHandshake, ImagePlus, MapPin, MessageCircle, Package, Star, Upload, UsersRound, WalletCards } from 'lucide-react';
import { artisans, workerById, workers } from '../data';
import { useApp } from '../store';
import type { LocalTask } from '../types';
import { currency, formatDate } from '../utils';
import { Button, Eyebrow, ImageWithFallback, PageHeading } from '../components/UI';

async function compressTaskPhoto(file: File): Promise<string> {
  const source = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Photo could not be read.')); reader.readAsDataURL(file); });
  return new Promise((resolve) => { const image = new Image(); image.onload = () => { const scale = Math.min(1, 960 / Math.max(image.width, image.height)); const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale); const context = canvas.getContext('2d'); if (!context) { resolve(source); return; } context.drawImage(image, 0, 0, canvas.width, canvas.height); resolve(canvas.toDataURL('image/jpeg', 0.75)); }; image.onerror = () => resolve(source); image.src = source; });
}

function statusText(status: LocalTask['status']) {
  return ({ assigned: 'Assigned', 'in-progress': 'In progress', 'ready-for-review': 'Ready for review', 'revision-requested': 'Changes requested', completed: 'Completed' })[status];
}

export function CollaborationPage() {
  const navigate = useNavigate();
  const { data, addTask, notify } = useApp();
  const myProducts = data.products.filter((product) => product.artisanId === 'laxmi' && product.listed);
  const [title, setTitle] = useState('Need help with embroidery finishing for a large order.');
  const [skill, setSkill] = useState('Embroidery finishing');
  const [quantity, setQuantity] = useState('4');
  const [deadline, setDeadline] = useState('2026-10-28');
  const [payment, setPayment] = useState('800');
  const [description, setDescription] = useState('Help trim threads and finish four Kasuti panels before a larger festive order ships.');
  const [selectedWorker, setSelectedWorker] = useState('sunita');
  const [productId, setProductId] = useState(myProducts.find((product) => product.id === 'kasuti-blouse')?.id ?? myProducts[0]?.id ?? '');
  const [error, setError] = useState('');
  const activeTasks = data.tasks.filter((task) => task.status !== 'completed');

  const assign = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedWorker) { setError('Choose a local worker before assigning the task.'); return; }
    if (!title.trim() || !description.trim()) { setError('Add a task title and a short description.'); return; }
    const task: LocalTask = {
      id: `task-${Date.now().toString(36)}`,
      title: title.trim(),
      requiredSkill: skill,
      quantity: Math.max(1, Number(quantity) || 1),
      deadline,
      offeredPayment: Math.max(0, Number(payment) || 0),
      description: description.trim(),
      artisanId: 'laxmi',
      workerId: selectedWorker,
      productId: productId || undefined,
      status: 'assigned',
      paymentReleased: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    addTask(task);
    notify(`Task assigned to ${workerById(selectedWorker)?.name ?? 'a local worker'}.`, 'success');
    navigate(`/tasks/${task.id}`);
  };

  return <div className="collaboration-page content-width"><PageHeading eyebrow="Local skill, shared opportunity" title="Bring more hands into the work." description="Post a clear task, agree on payment and make every contribution part of the product story." action={<Link to="/worker" className="btn btn-outline">Open worker view <ArrowRight size={15} /></Link>} />
    <div className="collab-impact-strip"><span className="collab-impact-icon"><HeartHandshake size={18} /></span><div><b>Make larger orders feel possible.</b><p>KalaSetu helps artisans find nearby skilled workers and keeps their contribution visible in the making journey.</p></div><div className="collab-impact-stat"><strong>{activeTasks.length}</strong><span>active local tasks</span></div></div>
    <div className="collaboration-layout"><form className="task-form-card surface-card" onSubmit={assign}><div className="form-card-title"><span className="form-card-icon"><BriefcaseBusiness size={18} /></span><div><span className="eyebrow-small">POST A LOCAL TASK</span><h2>What help do you need?</h2></div></div><p className="form-card-intro">Keep the task simple and clear. The worker sees the agreed amount before accepting.</p>{error && <div className="form-alert error-alert" role="alert">{error}</div>}
      <label className="field"><span>Task title <b>*</b></span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label><div className="form-grid"><label className="field"><span>Required skill</span><select value={skill} onChange={(event) => setSkill(event.target.value)}><option>Embroidery finishing</option><option>Kasuti embroidery</option><option>Thread trimming</option><option>Textile finishing</option><option>Quality check</option></select></label><label className="field"><span>Quantity</span><div className="input-suffix"><input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /><span>pieces</span></div></label><label className="field"><span>Deadline</span><div className="date-input"><CalendarDays size={15} /><input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></div></label><label className="field"><span>Offered payment</span><div className="currency-input"><i>₹</i><input type="number" min="0" value={payment} onChange={(event) => setPayment(event.target.value)} /></div></label><label className="field span-2"><span>Linked product <small>(optional)</small></span><select value={productId} onChange={(event) => setProductId(event.target.value)}><option value="">No product yet</option>{myProducts.map((product) => <option value={product.id} key={product.id}>{product.name}</option>)}</select><small className="field-hint">A worker's approved contribution can appear in this product's making journey.</small></label><label className="field span-2"><span>What needs to be done?</span><textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} /></label></div>
      <div className="task-form-footer"><span><ShieldCheckMini /> No payment is collected here; this is a local workflow simulation.</span><Button type="submit" icon={<ArrowRight size={16} />}>Assign this task</Button></div>
    </form>

    <aside className="workers-side-panel"><div className="workers-panel-heading"><div><span className="eyebrow-small">NEARBY SKILLED HANDS</span><h2>Choose a worker.</h2><p>People in Laxmi's local craft network.</p></div><span className="nearby-dot" title="Available locally" /></div><div className="worker-select-list">{workers.map((worker) => <button className={`worker-select-card${selectedWorker === worker.id ? ' worker-selected' : ''}`} key={worker.id} onClick={() => { setSelectedWorker(worker.id); setError(''); }} type="button" aria-pressed={selectedWorker === worker.id}><span className="worker-select-check">{selectedWorker === worker.id ? <Check size={13} /> : null}</span><span className="worker-card-photo"><ImageWithFallback src={worker.image} alt={worker.name} /></span><span className="worker-select-info"><strong>{worker.name}</strong><span>{worker.role}</span><span className="worker-rating"><Star size={12} fill="currentColor" /> {worker.rating} <i>·</i> {worker.completedTasks} tasks</span></span><span className="worker-avail-tag">{worker.availability}</span><span className="worker-skills">{worker.skills.slice(0, 2).join(' · ')}</span></button>)}</div><div className="workers-panel-note"><UsersRound size={16} /><span>Worker profiles show skills and completed tasks. Assignment, progress and payment confirmation are simulated.</span></div></aside></div>
    <section className="active-task-section"><div className="section-title-line"><div><span className="eyebrow-small">KEEP THINGS MOVING</span><h2>Current community tasks</h2></div><Link to="/worker" className="text-link">Go to worker view <ArrowRight size={15} /></Link></div>{data.tasks.length ? <div className="active-task-grid">{data.tasks.slice(0, 3).map((task) => { const worker = workerById(task.workerId); const product = data.products.find((item) => item.id === task.productId); return <Link to={`/tasks/${task.id}`} className="active-task-card" key={task.id}><div className="active-task-top"><span className={`task-status-chip task-status-${task.status}`}>{statusText(task.status)}</span><ArrowRight size={15} /></div><h3>{task.title}</h3><p>{worker?.name ?? 'Local worker'} <i>·</i> {task.requiredSkill}</p><div className="active-task-bottom"><span><CalendarDays size={13} /> Due {formatDate(task.deadline)}</span><strong>{currency(task.offeredPayment)}</strong></div>{product && <span className="linked-product-chip"><Package size={12} /> {product.name}</span>}</Link>; })}</div> : <div className="empty-state"><p>No local tasks yet. Create one above to bring in support.</p></div>}</section>
  </div>;
}

function ShieldCheckMini() { return <span className="shield-check-mini"><BadgeCheck size={14} /></span>; }

export function WorkerDashboardPage() {
  const { data } = useApp();
  const open = data.tasks.filter((task) => task.status !== 'completed');
  const completed = data.tasks.filter((task) => task.status === 'completed');
  const activeAmount = open.reduce((sum, task) => sum + task.offeredPayment, 0);
  return <div className="worker-dashboard content-width"><PageHeading eyebrow="Worker workspace · Dharwad" title="Good work is shared work." description="Your skills help a craft travel further. Follow your assignment, share progress and make your contribution visible." action={<Link to="/collaboration" className="btn btn-secondary">Find local work <ArrowRight size={15} /></Link>} />
    <section className="worker-welcome-card"><div className="worker-welcome-photo"><ImageWithFallback src="/images/artisan-portrait.jpg" alt="Sunita, local textile finishing worker" /></div><div className="worker-welcome-copy"><span className="worker-verified-line"><BadgeCheck size={14} /> COMMUNITY WORKER PROFILE</span><h2>Sunita Devi</h2><p>Textile finishing <span>·</span> Dharwad, Karnataka</p><div className="worker-skill-chips"><span>Embroidery finishing</span><span>Thread trimming</span><span>Quality check</span></div></div><div className="worker-welcome-stat"><strong>4.9 <Star size={16} fill="currentColor" /></strong><span>32 completed tasks</span><small>Available this week</small></div></section>
    <section className="worker-metric-row"><div><span><BriefcaseBusiness size={17} /></span><p>Open tasks</p><strong>{open.length}</strong></div><div><span><WalletCards size={17} /></span><p>Agreed payments</p><strong>{currency(activeAmount)}</strong></div><div><span><CheckCircle2 size={17} /></span><p>Completed tasks</p><strong>{completed.length + 32}</strong></div></section>
    <section className="worker-tasks-section"><div className="section-title-line"><div><span className="eyebrow-small">YOUR LOCAL WORKBOARD</span><h2>Tasks in the community</h2></div><span className="worker-task-filter"><span className="nearby-dot" /> Showing assignments in your craft network</span></div>{data.tasks.length ? <div className="worker-task-grid">{data.tasks.map((task) => { const worker = workerById(task.workerId); const product = data.products.find((item) => item.id === task.productId); return <article className={`worker-task-card${task.status === 'completed' ? ' worker-task-complete' : ''}`} key={task.id}><div className="worker-task-card-header"><span className={`task-status-chip task-status-${task.status}`}>{statusText(task.status)}</span><span className="worker-task-payment">{currency(task.offeredPayment)}</span></div><h3>{task.title}</h3><p>{task.description}</p><div className="worker-task-meta"><span><UsersRound size={14} />{worker?.name} <i>·</i> {task.requiredSkill}</span><span><CalendarDays size={14} />{formatDate(task.deadline)}</span></div><div className="worker-task-footer">{product && <span><Package size={13} /> Contributes to {product.name}</span>}<Link to={`/tasks/${task.id}`} className="task-open-link">{task.status === 'completed' ? 'View completed task' : 'Open task'} <ArrowRight size={14} /></Link></div></article>; })}</div> : <div className="worker-empty"><HeartHandshake size={26} /><h3>No tasks yet.</h3><p>When an artisan posts local work, it will show up here.</p><Link to="/collaboration" className="text-link">See how collaboration works <ArrowRight size={14} /></Link></div>}</section>
    <section className="worker-credit-note"><span><BadgeCheck size={17} /></span><p><b>Your work should be seen.</b> When a task is linked to a product, an approved progress update can appear in the product's making journey with your contribution attributed.</p></section>
  </div>;
}

export function TaskDetailPage() {
  const { taskId = '' } = useParams();
  const { data, updateTask, updateProduct, setRole, notify } = useApp();
  const navigate = useNavigate();
  const task = data.tasks.find((item) => item.id === taskId);
  const fileInput = useRef<HTMLInputElement>(null);
  const [progressImage, setProgressImage] = useState('');
  const [progressNote, setProgressNote] = useState('The edge finishing is complete. I checked the thread ends and kept the stitches even.');
  const [requestNote, setRequestNote] = useState('');
  const [photoError, setPhotoError] = useState('');
  const worker = task ? workerById(task.workerId) : undefined;
  const artisan = task ? artisans.find((item) => item.id === task.artisanId) : undefined;
  const product = task?.productId ? data.products.find((item) => item.id === task.productId) : undefined;

  if (!task) return <div className="content-width not-found"><h1>That task isn't in the demo.</h1><Link to="/collaboration">Back to local tasks <ArrowRight size={15} /></Link></div>;

  const setSamplePhoto = () => { setProgressImage(worker?.portfolio[0] ?? '/images/embroidery-process.jpg'); setPhotoError(''); };
  const uploadPhoto = async (file?: File) => { if (!file) return; if (!file.type.startsWith('image/')) { setPhotoError('Choose an image file to share an update.'); return; } try { setProgressImage(await compressTaskPhoto(file)); setPhotoError(''); } catch { setPhotoError('This photo could not be added. Try another one.'); } };
  const submitProgress = () => {
    if (!progressNote.trim()) { setPhotoError('Add a short progress note before sending.'); return; }
    if (!progressImage) { setPhotoError('Upload a progress photo or choose a sample photo before sending.'); return; }
    const image = progressImage;
    updateTask(task.id, { status: 'ready-for-review', progressNote: progressNote.trim(), progressImage: image, requestNote: '' });
    if (task.productId && product) {
      const stages = product.stages.map((stage) => stage.id === 'finishing' ? { ...stage, status: 'supported' as const, image, contributor: worker?.name ?? 'Local worker', evidenceType: 'Worker progress update' as const, timestamp: new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date()), note: progressNote.trim() } : stage);
      updateProduct(product.id, { stages });
    }
    notify('Progress sent to Laxmi for review. The linked product journey now shows your contribution.', 'success');
  };
  const requestChanges = () => {
    updateTask(task.id, { status: 'revision-requested', requestNote: requestNote.trim() || 'Please check the final edge and share one more progress photo.', paymentReleased: false });
    notify('Changes requested. The worker can send another progress update.', 'info');
  };
  const approveTask = () => {
    updateTask(task.id, { status: 'completed', paymentReleased: true });
    notify(`Task completed. A simulated ${currency(task.offeredPayment)} payment release is confirmed.`, 'success');
  };

  const workerCanSubmit = data.role === 'worker' && !['ready-for-review', 'completed'].includes(task.status);
  const artisanCanReview = data.role === 'artisan' && task.status === 'ready-for-review';
  const completed = task.status === 'completed';

  return <div className="task-detail-page content-width"><div className="detail-breadcrumb"><Link to={data.role === 'worker' ? '/worker' : '/collaboration'}><ArrowLeft size={14} /> {data.role === 'worker' ? 'Worker workspace' : 'Local collaboration'}</Link><span>/</span><span>Task details</span></div><PageHeading eyebrow="Community task · Local collaboration" title={task.title} description="Clear expectations, fair agreed payment and work that stays connected to its maker." action={<span className={`task-status-chip task-status-${task.status}`}>{statusText(task.status)}</span>} />
    <div className="task-detail-layout"><section className="task-detail-main"><div className="task-participants-card surface-card"><div className="task-participant"><ImageWithFallback src={artisan?.image} alt={artisan?.name ?? 'Artisan'} /><span><small>ARTISAN</small><b>{artisan?.name ?? 'KalaSetu artisan'}</b><span>{artisan?.location}</span></span></div><div className="task-link-symbol"><HeartHandshake size={18} /></div><div className="task-participant"><ImageWithFallback src={worker?.image} alt={worker?.name ?? 'Worker'} /><span><small>LOCAL WORKER</small><b>{worker?.name ?? 'Local worker'}</b><span>{worker?.role}</span></span></div></div>
      <div className="task-requirements-card surface-card"><div className="task-requirement-heading"><div><span className="eyebrow-small">AGREED TASK DETAILS</span><h2>One clear brief. Shared expectations.</h2></div><div className="task-agreed-payment"><small>AGREED PAYMENT</small><strong>{currency(task.offeredPayment)}</strong></div></div><p className="task-requirement-description">{task.description}</p><div className="task-requirement-grid"><div><span><BriefcaseBusiness size={14} /> Skill</span><strong>{task.requiredSkill}</strong></div><div><span><Package size={14} /> Quantity</span><strong>{task.quantity} pieces</strong></div><div><span><CalendarDays size={14} /> Deadline</span><strong>{formatDate(task.deadline)}</strong></div><div><span><WalletCards size={14} /> Payment</span><strong>{currency(task.offeredPayment)} agreed</strong></div></div>{product && <Link to={`/products/${product.id}`} className="task-linked-product"><span><Package size={15} /></span><span><small>LINKED PRODUCT</small><b>{product.name}</b></span><ArrowRight size={15} /></Link>}</div>
      <div className="task-progress-card surface-card"><div className="task-progress-title"><div><span className="eyebrow-small">TASK PROGRESS</span><h2>{completed ? 'The work is complete.' : task.status === 'ready-for-review' ? 'Progress is ready to review.' : task.status === 'revision-requested' ? 'A small update is requested.' : task.status === 'in-progress' ? 'Work is moving.' : 'A good start, together.'}</h2></div><span className={`task-progress-badge ${completed ? 'progress-complete' : ''}`}>{completed ? <CheckCircle2 size={17} /> : <Clock3 size={17} />}</span></div>
        <div className="task-progress-steps"><span className="progress-step progress-done"><i><Check size={12} /></i><b>Assigned</b></span><span className={`progress-connector${['in-progress', 'ready-for-review', 'completed'].includes(task.status) ? ' connector-active' : ''}`} /><span className={`progress-step${['in-progress', 'ready-for-review', 'completed'].includes(task.status) ? ' progress-done' : ''}`}><i>{['in-progress', 'ready-for-review', 'completed'].includes(task.status) ? <Check size={12} /> : '02'}</i><b>Work update</b></span><span className={`progress-connector${['ready-for-review', 'completed'].includes(task.status) ? ' connector-active' : ''}`} /><span className={`progress-step${['ready-for-review', 'completed'].includes(task.status) ? ' progress-done' : ''}`}><i>{['ready-for-review', 'completed'].includes(task.status) ? <Check size={12} /> : '03'}</i><b>Artisan review</b></span><span className={`progress-connector${completed ? ' connector-active' : ''}`} /><span className={`progress-step${completed ? ' progress-done' : ''}`}><i>{completed ? <Check size={12} /> : '04'}</i><b>Payment</b></span></div>
        {task.status === 'ready-for-review' && <div className="work-update-preview"><div className="work-update-photo"><ImageWithFallback src={task.progressImage} alt="Worker progress update" /></div><div><span className="work-update-label"><BadgeCheck size={13} /> WORKER UPDATE · {worker?.name}</span><p>{task.progressNote}</p><small>Shared progress photo · A maker-submitted update</small></div></div>}
        {task.status === 'revision-requested' && <div className="request-note-box"><MessageCircle size={15} /><span><b>Artisan asked for a change:</b> {task.requestNote}</span></div>}
        {completed && <div className="payment-release-confirm"><span><CheckCircle2 size={18} /></span><div><b>Payment release simulated</b><p>{currency(task.offeredPayment)} marked as released to {worker?.name}. No financial transaction took place.</p></div></div>}
        {workerCanSubmit && <div className="worker-update-form"><div className="worker-update-intro"><span className="worker-update-icon"><Upload size={17} /></span><div><b>{task.status === 'revision-requested' ? 'Share the requested update.' : 'Send a progress update.'}</b><span>Add a short note and a photo of your work.</span></div></div>{photoError && <div className="form-alert error-alert" role="alert">{photoError}</div>}<label className="field"><span>Progress note</span><textarea rows={3} value={progressNote} onChange={(event) => setProgressNote(event.target.value)} /></label><input ref={fileInput} className="visually-hidden sr-only" type="file" accept="image/*" aria-label="Upload a progress photo" onChange={(event) => { void uploadPhoto(event.target.files?.[0]); event.target.value = ''; }} /><div className="update-photo-tools"><Button variant="outline" size="small" onClick={() => fileInput.current?.click()} icon={<ImagePlus size={14} />}>Upload progress photo</Button><Button variant="quiet" size="small" onClick={setSamplePhoto}>Use sample photo</Button>{progressImage && <span className="update-photo-status"><CheckCircle2 size={13} /> Photo ready</span>}</div>{progressImage && <div className="worker-progress-preview"><ImageWithFallback src={progressImage} alt="Selected work update preview" /></div>}<Button onClick={submitProgress} icon={<ArrowRight size={15} />}>Send update to artisan</Button></div>}
        {artisanCanReview && <div className="artisan-review-actions"><div className="review-message"><CheckCircle2 size={16} /><p><b>Worker update received.</b> Review the progress photo and note before approving the task.</p></div><label className="field"><span>Note for the worker <small>(only needed if requesting changes)</small></span><textarea rows={2} value={requestNote} onChange={(event) => setRequestNote(event.target.value)} placeholder="e.g. Please finish the edge on one more panel." /></label><div className="review-action-row"><Button variant="outline" onClick={requestChanges}>Request changes</Button><Button onClick={approveTask} icon={<CheckCircle2 size={16} />}>Approve & release payment</Button></div></div>}
        {!workerCanSubmit && !artisanCanReview && !completed && <div className="role-action-prompt"><span><UsersRound size={16} /></span><p>{task.status === 'ready-for-review' ? 'Switch to the Artisan role to review this update and confirm completion.' : 'Switch to the Worker role to share a progress update.'}</p><Button variant="outline" size="small" onClick={() => { setRole(task.status === 'ready-for-review' ? 'artisan' : 'worker'); notify(`You are now viewing as ${task.status === 'ready-for-review' ? 'Laxmi the artisan' : 'Sunita the worker'}.`, 'info'); }}>Open {task.status === 'ready-for-review' ? 'artisan' : 'worker'} view</Button></div>}
      </div></section>
      <aside className="task-detail-sidebar"><div className="community-note-card"><span className="community-note-icon"><HeartHandshake size={19} /></span><span className="eyebrow-small">A STRONGER CRAFT COMMUNITY</span><h3>Work grows when it is shared.</h3><p>This workflow connects Laxmi to local skills, makes the agreed payment visible and credits the worker in the linked product journey.</p><div className="community-mini-avatars"><ImageWithFallback src="/images/kasuti-hero.png" alt="Laxmi" /><ImageWithFallback src={worker?.image} alt={worker?.name ?? 'Worker'} /><span><HeartHandshake size={14} /></span></div></div><div className="task-limit-note"><BadgeCheck size={16} /><p><b>Prototype only.</b><br />Task assignment, progress review and payment release are local simulations. No escrow or money transfer is connected.</p></div><Link to="/collaboration" className="sidebar-link">Post another local task <ArrowRight size={14} /></Link></aside>
    </div></div>;
}
