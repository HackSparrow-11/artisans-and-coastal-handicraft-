import { useState, type ChangeEvent, type ImgHTMLAttributes, type ReactNode } from 'react';
import { BadgeCheck, CircleAlert, Info } from 'lucide-react';
import type { VerificationStatus } from '../types';
import { statusLabel } from '../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'quiet' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({ children, variant = 'primary', size = 'medium', icon, fullWidth, className = '', ...props }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} btn-${size}${fullWidth ? ' btn-full' : ''}${className ? ` ${className}` : ''}`} {...props}>
      {icon && <span className="btn-icon">{icon}</span>}{children}
    </button>
  );
}

export function StatusTag({ status, compact = false }: { status: VerificationStatus; compact?: boolean }) {
  const icon = status === 'approved' ? <BadgeCheck size={14} /> : status === 'needs-evidence' || status === 'rejected' ? <CircleAlert size={14} /> : <Info size={14} />;
  return <span className={`status-tag status-${status}${compact ? ' status-compact' : ''}`}>{icon}{!compact && statusLabel(status)}</span>;
}

export function ImageWithFallback({ className = '', alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  const src = failed ? '/images/embroidered-wall-art.jpg' : props.src;
  return <img {...props} src={src} alt={alt ?? ''} className={className} onError={(event: ChangeEvent<HTMLImageElement>) => { setFailed(true); props.onError?.(event); }} />;
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`eyebrow${light ? ' eyebrow-light' : ''}`}><span className="eyebrow-mark" />{children}</div>;
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="page-heading-row">
      <div className="page-heading">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="page-heading-action">{action}</div>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`surface-card${className ? ` ${className}` : ''}`}>{children}</section>;
}
