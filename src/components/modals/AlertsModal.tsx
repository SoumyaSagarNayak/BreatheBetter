import React, { useState, useEffect } from 'react';
import { Bell, X, ShieldAlert, CheckCircle, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAqi: number;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  currentAqi,
}) => {
  const [threshold, setThreshold] = useState<number>(() => {
    return Number(localStorage.getItem('bb_alert_threshold')) || 150;
  });
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('bb_alert_enabled') === 'true';
  });
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermissionStatus(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleAlerts = async () => {
    if (!isEnabled) {
      if (typeof Notification === 'undefined') {
        alert('Browser Notifications are not supported on this device.');
        return;
      }

      if (Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission();
        setPermissionStatus(perm);
        if (perm !== 'granted') {
          alert('Notification permission was not granted. Please allow notifications in your browser settings.');
          return;
        }
      }

      setIsEnabled(true);
      localStorage.setItem('bb_alert_enabled', 'true');
      localStorage.setItem('bb_alert_threshold', threshold.toString());
    } else {
      setIsEnabled(false);
      localStorage.setItem('bb_alert_enabled', 'false');
    }
  };

  const handleTestAlert = () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('BreatheBetter Alert: Air Quality Threshold Notice', {
        body: `Ambient AQI is currently ${currentAqi}. Your configured alert threshold is ${threshold}. Please take appropriate health precautions.`,
        icon: '/leaf-wind-logo.svg',
      });
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 3000);
    } else {
      alert('Please enable notifications first.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-2xl border shadow-2xl bg-forest-900 border-forest-700 text-slate-100 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline theme-cream:text-editorial-ink space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white theme-cream:text-editorial-muted theme-cream:hover:text-editorial-ink"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-mint-400 theme-cream:bg-editorial-surface-card theme-cream:text-editorial-primary">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-normal text-white theme-cream:text-editorial-ink">
              Pollution Threshold Alerts
            </h3>
            <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
              Receive native browser push notifications when air pollution breaches safety levels
            </p>
          </div>
        </div>

        {/* Configuration Body */}
        <div className="space-y-4 pt-2">
          {/* Threshold Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 theme-cream:text-editorial-body block">
              Notify me when AQI exceeds:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[100, 150, 200].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setThreshold(val);
                    localStorage.setItem('bb_alert_threshold', val.toString());
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-mono border transition-all ${
                    threshold === val
                      ? 'border-mint-500 bg-forest-800 text-mint-300 font-bold theme-cream:border-editorial-primary theme-cream:bg-editorial-primary/10 theme-cream:text-editorial-primary'
                      : 'border-forest-800 bg-forest-950/60 text-slate-400 hover:text-white theme-cream:border-editorial-hairline theme-cream:bg-editorial-surface-soft theme-cream:text-editorial-muted'
                  }`}
                >
                  AQI &gt; {val}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 theme-cream:text-editorial-muted">
              {threshold === 100
                ? 'Sensitive groups alert (moderate threshold)'
                : threshold === 150
                ? 'Unhealthy for all populations alert (recommended)'
                : 'Emergency hazardous threshold only'}
            </p>
          </div>

          {/* Toggle Alert Button */}
          <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-forest-950/60 border border-forest-800 theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline">
            <div>
              <span className="text-xs font-medium block text-slate-200 theme-cream:text-editorial-body-strong">
                Browser Notification Trigger
              </span>
              <span className="text-[11px] text-slate-400 theme-cream:text-editorial-muted">
                Status: {isEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <Button
              variant={isEnabled ? 'outline' : 'primary'}
              size="sm"
              onClick={handleToggleAlerts}
            >
              {isEnabled ? 'Turn Off' : 'Enable Alerts'}
            </Button>
          </div>

          {/* Test Trigger */}
          {isEnabled && (
            <div className="flex items-center justify-between pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTestAlert}
                className="text-xs flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Send Test Notification
              </Button>
              {testNotificationSent && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle className="w-3 h-3" /> Sent!
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

