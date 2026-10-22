import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, Camera, Check, CheckCircle2, CircleDollarSign, Clock3, ImagePlus, Mic2, PackageCheck, Sparkles, Upload, WandSparkles } from 'lucide-react';
import { artisans, stageLabels } from '../data';
import { useApp } from '../store';
import type { Product, ProvenanceStage, ProductStageId, PricingBreakdown } from '../types';
import { currency, minimumPrice, recommendedPrice } from '../utils';
import { Button, Eyebrow, ImageWithFallback, PageHeading } from '../components/UI';

interface DraftDetails { name: string; craft: string; material: string; hours: number; description: string; }
const defaults: DraftDetails = {
  name: 'Kasuti Garden Blouse Piece',
  craft: 'Kasuti embroidery',
  material: 'Handwoven cotton',
  hours: 24,
  description: 'A soft, handwoven cotton blouse piece brought to life with a fine Kasuti garden motif, stitched one line at a time.',
};
const initialPricing: PricingBreakdown = { materialCost: 720, artisanHours: 24, hourlyRate: 50, helperPayments: 200, packaging: 100, shipping: 120, overhead: 160, marginPercent: 20 };
const demoStageImages: Record<ProductStageId, string> = {
  raw: '/images/embroidery-color.jpg',
  work: '/images/embroidery-process.jpg',
  finishing: '/images/kasuti-detail.jpg',
  packed: '/images/embroidered-wall-art.jpg',
};
const demoStageNotes: Record<ProductStageId, string> = {
  raw: 'Cotton and thread selected for the piece.',
  work: 'A progress moment from the embroidery table.',
  finishing: 'The final stitch and edge check.',
  packed: 'Ready for a thoughtful new home.',
};

function nowLabel() { return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date()); }

async function compressImage(file: File): Promise<string> {
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read this image.'));
    reader.readAsDataURL(file);
  });
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const maxSize = 960;
      const ratio = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * ratio);
      canvas.height = Math.round(image.height * ratio);
      const context = canvas.getContext('2d');
      if (!context) { resolve(data); return; }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.76));
    };
    image.onerror = () => resolve(data);
    image.src = data;
  });
}

function categoryForCraft(craft: string) {
  const value = craft.toLowerCase();
  if (value.includes('block')) return 'Block printing';
  if (value.includes('weav') || value.includes('handloom')) return 'Weaving';
  if (value.includes('pottery')) return 'Pottery';
  if (value.includes('decor')) return 'Home decor';
  if (value.includes('textile')) return 'Textiles';
  return 'Embroidery';
}

function fallbackImageForCraft(craft: string) {
  const category = categoryForCraft(craft);
  if (category === 'Block printing') return '/images/block-print-runner.jpg';
  if (category === 'Weaving') return '/images/handloom-scarf.png';
  if (category === 'Pottery') return '/images/blue-pottery.png';
  if (category === 'Home decor') return '/images/embroidered-wall-art.jpg';
  if (category === 'Textiles') return '/images/green-lotus-tote.jpg';
  return '/images/kasuti-detail.jpg';
}

export function AddProductPage() {
  const navigate = useNavigate();
  const { addProduct, notify } = useApp();
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<DraftDetails>(defaults);
  const [pricing, setPricing] = useState<PricingBreakdown>(initialPricing);
  const [customPrice, setCustomPrice] = useState('');
  const [stages, setStages] = useState<ProvenanceStage[]>(stageLabels.map(({ id, label }) => ({ id, label, status: 'missing' })));
  const [listening, setListening] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);
  const [voiceUsed, setVoiceUsed] = useState(false);
  const [error, setError] = useState('');
  const [uploadingStage, setUploadingStage] = useState<ProductStageId | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const minimum = useMemo(() => minimumPrice(pricing), [pricing]);
  const suggested = useMemo(() => Math.round(recommendedPrice(pricing)), [pricing]);
  const finalPrice = customPrice.trim() ? Math.max(0, Number(customPrice) || 0) : suggested;
  const evidenceTotal = stages.filter((item) => item.status === 'supported').length;

  const updateDetails = (key: keyof DraftDetails, value: string | number) => {
    setDetails((current) => ({ ...current, [key]: value }));
    if (key === 'hours') setPricing((current) => ({ ...current, artisanHours: Math.max(0, Number(value) || 0) }));
  };
  const updatePricing = (key: keyof PricingBreakdown, value: string) => setPricing((current) => ({ ...current, [key]: Math.max(0, Number(value) || 0) }));
  const updateStage = (id: ProductStageId, patch: Partial<ProvenanceStage>) => setStages((current) => current.map((stage) => stage.id === id ? { ...stage, ...patch } : stage));

  const handleUpload = async (id: ProductStageId, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Choose an image file to add evidence.'); return; }
    setError('');
    setUploadingStage(id);
    try {
      const image = await compressImage(file);
      updateStage(id, { image, status: 'supported', evidenceType: 'Gallery Upload', timestamp: nowLabel(), contributor: 'Laxmi Hegde', note: 'Added from device gallery.' });
    } catch {
      setError('That image could not be added. Please try another photo.');
    } finally {
      setUploadingStage(null);
    }
  };

  const simulateCapture = (id: ProductStageId) => {
    updateStage(id, { image: demoStageImages[id], status: 'supported', evidenceType: 'Simulated Camera Capture', timestamp: nowLabel(), contributor: 'Laxmi Hegde', note: demoStageNotes[id] });
    notify('A sample camera capture has been added. This is simulated evidence.', 'info');
  };

  const useExampleJourney = () => {
    setStages(stageLabels.map(({ id, label }) => ({ id, label, image: demoStageImages[id], status: 'supported', evidenceType: id === 'work' ? 'Simulated Camera Capture' : 'Gallery Upload', timestamp: nowLabel(), contributor: 'Laxmi Hegde', note: demoStageNotes[id] })));
    notify('Four sample making moments added for this demo.', 'info');
  };

  const runVoiceDemo = () => {
    if (listening) return;
    setListening(true);
    setError('');
    window.setTimeout(() => {
      setDetails({ name: 'Kasuti Garden Blouse Piece', craft: 'Kasuti embroidery', material: 'Handwoven cotton', hours: 24, description: 'A handwoven cotton blouse piece with a Kasuti garden motif, stitched slowly by hand in Dharwad.' });
      setVoiceUsed(true);
      setListening(false);
      notify('Sample voice note transcribed. Review and edit the details before publishing.', 'info');
    }, 1500);
  };

  const runAiAssist = () => {
    const material = details.material || 'cotton';
    const craft = details.craft || 'handmade craft';
    const craftShort = craft.split(' ')[0];
    const itemType = details.name.match(/blouse piece|table runner|tote bag|tote|scarf|vase|wall textile/i)?.[0] ?? 'handmade piece';
    const title = `${craftShort} ${itemType.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;
    setDetails((current) => ({
      ...current,
      name: title,
      description: `Made from ${material.toLowerCase()}, this ${craft.toLowerCase()} piece carries the rhythm of ${details.hours || 1} hours of careful handwork. Each detail is finished by hand, making every piece quietly one of a kind.`,
    }));
    setAiUsed(true);
    notify('A simulated AI title and description are ready to edit.', 'info');
  };

  const publish = () => {
    if (!details.name.trim()) { setStep(1); setError('Add a product name before publishing.'); return; }
    const profile = artisans.find((artisan) => artisan.id === 'laxmi')!;
    const product: Product = {
      id: `kal-${Date.now().toString(36)}`,
      name: details.name.trim(),
      category: categoryForCraft(details.craft),
      craft: details.craft,
      material: details.material,
      image: stages.find((item) => item.status === 'supported' && item.image)?.image ?? fallbackImageForCraft(details.craft),
      price: finalPrice,
      description: details.description.trim() || `${details.craft} handmade in ${profile.location}.`,
      story: `${details.name.trim()} is made by Laxmi Hegde, a ${profile.yearsExperience}-year Kasuti embroidery artisan in ${profile.location}. This listing shares the time, materials and making moments behind the work.`,
      artisanId: 'laxmi',
      pricing: { ...pricing, artisanHours: details.hours },
      stages: stages.map((item) => ({ ...item })),
      verificationStatus: 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
      listed: true,
    };
    addProduct(product);
    setError('');
    notify('Your product is live in the marketplace. Community review is still pending.', 'success');
    navigate(`/products/${product.id}`);
  };

  return <div className="flow-page content-width">
    <button className="back-link" onClick={() => navigate('/artisan')}><ArrowLeft size={15} /> Back to artisan workspace</button>
    <PageHeading eyebrow="Create a listing · Laxmi's workspace" title="Bring your product to life." description="A few simple steps help buyers understand the skill and care behind your work." />

    <div className="flow-stepper" aria-label={`Step ${step} of 3`}>
      {[{ n: 1, title: 'Product details', note: 'What are you making?' }, { n: 2, title: 'Making journey', note: 'Share the work in progress' }, { n: 3, title: 'Fair price', note: 'See what goes into your price' }].map((item, index) => <button key={item.n} className={`flow-step${step === item.n ? ' flow-step-active' : ''}${step > item.n ? ' flow-step-done' : ''}`} onClick={() => setStep(item.n)}><span className="flow-step-number">{step > item.n ? <Check size={15} /> : `0${item.n}`}</span><span><strong>{item.title}</strong><small>{item.note}</small></span>{index < 2 && <span className="flow-step-line" />}</button>)}
    </div>

    {error && <div className="form-alert error-alert" role="alert">{error}</div>}

    {step === 1 && <div className="wizard-layout"><section className="wizard-main surface-card"><div className="wizard-heading"><span className="step-kicker">STEP 01 · DETAILS</span><h2>Tell us about your product.</h2><p>Start with the details a buyer would want to know.</p></div>
      <div className="form-grid"><label className="field span-2"><span>Product name <b>*</b></span><input value={details.name} onChange={(event) => updateDetails('name', event.target.value)} placeholder="e.g. Kasuti Garden Blouse Piece" /></label><label className="field"><span>Craft type</span><select value={details.craft} onChange={(event) => updateDetails('craft', event.target.value)}><option>Kasuti embroidery</option><option>Hand embroidery</option><option>Bagru block printing</option><option>Handloom weaving</option><option>Blue pottery</option><option>Textile finishing</option></select></label><label className="field"><span>Primary material</span><input value={details.material} onChange={(event) => updateDetails('material', event.target.value)} placeholder="e.g. Handwoven cotton" /></label><label className="field"><span>Production time</span><div className="input-suffix"><input type="number" min="0" value={details.hours} onChange={(event) => updateDetails('hours', Math.max(0, Number(event.target.value)))} /><span>hours</span></div></label><label className="field span-2"><span>Product description</span><textarea rows={4} value={details.description} onChange={(event) => updateDetails('description', event.target.value)} placeholder="Describe the materials, technique and little details that make it yours." /></label></div>
      <div className="assist-actions"><Button variant="outline" onClick={runVoiceDemo} disabled={listening} icon={listening ? <span className="listening-pulse" /> : <Mic2 size={16} />}>{listening ? 'Listening…' : voiceUsed ? 'Try voice input again' : 'Speak product details'}</Button><Button variant="outline" onClick={runAiAssist} icon={<WandSparkles size={16} />}>AI Assist</Button><span className="assist-disclaimer">Voice and AI are simulated for this prototype.</span></div>{(voiceUsed || aiUsed) && <div className="assist-feedback"><Sparkles size={14} />{aiUsed ? 'AI suggestion added — everything remains editable.' : 'Sample voice note added — review the transcript above.'}</div>}
      <div className="wizard-footer"><span className="save-note"><CheckCircle2 size={15} /> Your draft stays on this page as you move through the steps.</span><Button onClick={() => { setError(''); setStep(2); }}>Continue to making journey <ArrowRight size={16} /></Button></div>
    </section><aside className="wizard-aside"><div className="artisan-tip-card"><span className="tip-icon"><Sparkles size={18} /></span><span className="eyebrow-small">A LITTLE TIP</span><h3>Let your hands do the talking.</h3><p>Mention the technique, the material and the small details you notice while making. Buyers love knowing what makes a piece yours.</p><div className="tip-signature">— KalaSetu craft note</div></div><div className="wizard-aside-help"><span className="aside-help-icon"><Clock3 size={16} /></span><p><b>Made over {details.hours} hours?</b><br />We will use your time to show the labour behind your fair price.</p></div></aside></div>}

    {step === 2 && <div className="wizard-stage-wrap"><section className="stage-wizard-card surface-card"><div className="wizard-heading stage-heading-row"><div><span className="step-kicker">STEP 02 · PROVENANCE</span><h2>Show how this piece comes together.</h2><p>Photos make the making journey easier to understand. You choose what to share.</p></div><Button variant="outline" size="small" onClick={useExampleJourney} icon={<Sparkles size={15} />}>Add sample journey</Button></div>
      <div className="evidence-progress-row"><div><strong>{evidenceTotal} of 4 stages have photos</strong><span>Evidence is shared by you; it is not independently authenticated.</span></div><div className="evidence-progress-track"><i style={{ width: `${evidenceTotal * 25}%` }} /></div></div>
      <div className="stage-upload-grid">{stages.map((item, index) => <article className={`stage-upload-card${item.status === 'supported' ? ' stage-has-evidence' : ''}`} key={item.id}><div className="stage-upload-image">{item.image ? <ImageWithFallback src={item.image} alt={`${item.label} evidence preview`} /> : <span className="stage-empty-icon"><ImagePlus size={23} /></span>}<span className={`stage-number-tag${item.status === 'supported' ? ' stage-number-filled' : ''}`}>{String(index + 1).padStart(2, '0')}</span>{item.status === 'supported' && <span className="photo-status"><Check size={12} /> Added</span>}</div><div className="stage-upload-body"><div className="stage-label-row"><h3>{item.label}</h3><span className={item.status === 'supported' ? 'evidence-status-done' : 'evidence-status-missing'}>{item.status === 'supported' ? 'Photo added' : 'Photo missing'}</span></div>{item.status === 'supported' ? <p className="stage-timestamp">{item.timestamp} <span>·</span> {item.evidenceType}</p> : <p className="stage-hint">Add a photo or use the simulated camera.</p>}<div className="stage-upload-actions"><input ref={(element) => { fileInputs.current[item.id] = element; }} type="file" accept="image/*" className="visually-hidden sr-only" aria-label={`Upload ${item.label} image`} onChange={(event) => { void handleUpload(item.id, event.target.files?.[0]); event.target.value = ''; }} /><Button variant="outline" size="small" disabled={uploadingStage === item.id} onClick={() => fileInputs.current[item.id]?.click()} icon={<Upload size={14} />}>{uploadingStage === item.id ? 'Adding…' : 'Upload photo'}</Button><Button variant="quiet" size="small" onClick={() => simulateCapture(item.id)} icon={<Camera size={14} />}>Simulate capture</Button></div></div></article>)}</div>
      {evidenceTotal < 4 && <div className="missing-evidence-note"><span className="note-dot" /><span><b>Still to share:</b> {stages.filter((item) => item.status === 'missing').map((item) => item.label).join(', ')}. You can publish with an incomplete journey; missing moments will remain visible.</span></div>}
      <div className="wizard-footer"><Button variant="quiet" onClick={() => setStep(1)} icon={<ArrowLeft size={16} />}>Back</Button><Button onClick={() => { setError(''); setStep(3); }}>Continue to fair price <ArrowRight size={16} /></Button></div>
    </section></div>}

    {step === 3 && <div className="price-wizard-layout"><section className="price-calculator-card surface-card"><div className="wizard-heading"><span className="step-kicker">STEP 03 · FAIR PRICING</span><h2>A price that honours the work.</h2><p>Adjust any amount. Your recommendation updates instantly.</p></div>
      <div className="pricing-input-grid"><label className="field"><span>Raw material cost</span><div className="currency-input"><i>₹</i><input type="number" min="0" value={pricing.materialCost} onChange={(event) => updatePricing('materialCost', event.target.value)} /></div></label><label className="field"><span>Artisan working hours</span><div className="input-suffix"><input type="number" min="0" value={pricing.artisanHours} onChange={(event) => { updatePricing('artisanHours', event.target.value); updateDetails('hours', Number(event.target.value) || 0); }} /><span>hours</span></div></label><label className="field"><span>Hourly labour rate</span><div className="currency-input"><i>₹</i><input type="number" min="0" value={pricing.hourlyRate} onChange={(event) => updatePricing('hourlyRate', event.target.value)} /></div></label><label className="field"><span>Helper payments</span><div className="currency-input"><i>₹</i><input type="number" min="0" value={pricing.helperPayments} onChange={(event) => updatePricing('helperPayments', event.target.value)} /></div></label><label className="field"><span>Packaging</span><div className="currency-input"><i>₹</i><input type="number" min="0" value={pricing.packaging} onChange={(event) => updatePricing('packaging', event.target.value)} /></div></label><label className="field"><span>Shipping</span><div className="currency-input"><i>₹</i><input type="number" min="0" value={pricing.shipping} onChange={(event) => updatePricing('shipping', event.target.value)} /></div></label><label className="field"><span>Overhead</span><div className="currency-input"><i>₹</i><input type="number" min="0" value={pricing.overhead} onChange={(event) => updatePricing('overhead', event.target.value)} /></div></label><label className="field"><span>Livelihood margin</span><div className="input-suffix"><input type="number" min="0" max="200" value={pricing.marginPercent} onChange={(event) => updatePricing('marginPercent', event.target.value)} /><span>%</span></div></label></div>
      <div className="price-explainer"><CircleDollarSign size={17} /><p>Your price reflects the materials used, the time spent creating your product, the contribution of local helpers, and a fair livelihood margin.</p></div>
      <div className="price-breakdown"><div className="breakdown-head"><div><span className="eyebrow-small">YOUR PRICE, MADE CLEAR</span><h3>Where the value goes</h3></div><span className="breakdown-units">INR</span></div>
        <div className="cost-stack" aria-label="Cost breakdown"><span style={{ flexGrow: Math.max(pricing.materialCost, 1), background: '#c16d51' }} title="Materials" /><span style={{ flexGrow: Math.max(pricing.artisanHours * pricing.hourlyRate, 1), background: '#29304e' }} title="Artisan labour" /><span style={{ flexGrow: Math.max(pricing.helperPayments, 1), background: '#77896a' }} title="Helper contribution" /><span style={{ flexGrow: Math.max(pricing.packaging + pricing.shipping + pricing.overhead, 1), background: '#d3ac61' }} title="Other costs" /><span style={{ flexGrow: Math.max(Math.round(minimum * pricing.marginPercent / 100), 1), background: '#e6d5bd' }} title="Livelihood margin" /></div>
        <div className="breakdown-list"><div><i className="cost-dot dot-material" /><span>Total material cost</span><strong>{currency(pricing.materialCost)}</strong></div><div><i className="cost-dot dot-labour" /><span>Artisan labour · {pricing.artisanHours}h × {currency(pricing.hourlyRate)}</span><strong>{currency(pricing.artisanHours * pricing.hourlyRate)}</strong></div><div><i className="cost-dot dot-helper" /><span>Helper contribution</span><strong>{currency(pricing.helperPayments)}</strong></div><div><i className="cost-dot dot-other" /><span>Packaging, shipping & overhead</span><strong>{currency(pricing.packaging + pricing.shipping + pricing.overhead)}</strong></div></div>
        <div className="minimum-row"><span>Minimum sustainable price</span><strong>{currency(minimum)}</strong></div><div className="margin-row"><span>Livelihood margin <b>+{pricing.marginPercent}%</b></span><strong>+{currency(Math.round(minimum * pricing.marginPercent / 100))}</strong></div>
        <div className="suggested-price-row"><div><span>Recommended listing price</span><small>Minimum price + livelihood margin</small></div><strong>{currency(suggested)}</strong></div>
      </div>
      <div className="final-price-editor"><label className="field"><span>Your final listing price</span><div className="currency-input price-final-input"><i>₹</i><input type="number" min="0" value={customPrice} placeholder={String(suggested)} onChange={(event) => setCustomPrice(event.target.value)} /></div></label><Button variant="outline" size="small" onClick={() => setCustomPrice('')}>Use suggested price</Button><span className="price-edit-note">You can set a different price. The breakdown above stays transparent.</span></div>
    </section><aside className="publish-side-card"><div className="publish-preview"><div className="publish-preview-image"><ImageWithFallback src={stages.find((item) => item.image)?.image ?? fallbackImageForCraft(details.craft)} alt={details.name} /></div><span className="preview-craft-tag">{details.craft}</span><h3>{details.name || 'Your handmade product'}</h3><p>{details.description}</p><strong>{currency(finalPrice)}</strong></div><div className="publish-status"><span className="publish-status-icon"><BadgeCheck size={17} /></span><div><b>Ready to publish</b><small>{evidenceTotal} of 4 making moments included</small></div></div><Button size="large" fullWidth onClick={publish} icon={<PackageCheck size={17} />}>Publish product</Button><p className="publish-note">Your product appears in the buyer marketplace right away. Community review is a separate, visible step.</p><div className="publish-secure"><CheckCircle2 size={14} /> Your draft and pricing are saved locally in this demo.</div></aside></div>}

    <div className="prototype-note"><span className="prototype-note-icon"><Sparkles size={15} /></span><span><b>Prototype note:</b> AI, voice transcription and camera capture are simulated. Images, dates and origin details are not independently verified.</span></div>
  </div>;
}
