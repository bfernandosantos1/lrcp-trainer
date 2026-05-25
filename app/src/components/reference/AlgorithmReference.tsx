interface Props {
  onClose: () => void;
}

export function AlgorithmReference({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="monitor-panel max-w-4xl w-full max-h-[90vh] overflow-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-vital-cyan vital-glow-cyan font-clinical">LRCP Algorithm</h2>
          <button onClick={onClose} className="text-monitor-text/40 hover:text-monitor-bright text-xl">&times;</button>
        </div>

        {/* Algorithm Flowchart as styled divs */}
        <div className="space-y-4">
          {/* Entry */}
          <div className="text-center">
            <div className="inline-block bg-vital-cyan/10 border border-vital-cyan/30 rounded-lg px-4 py-2 text-sm font-semibold text-vital-cyan">
              IOC: Assess Cystic Duct & Stone Burden
            </div>
          </div>

          {/* Branch */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-0.5 h-6 bg-monitor-border mx-auto" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Branch: Cystic Duct >= 4mm */}
            <div className="space-y-3">
              <div className="bg-vital-green/10 border border-vital-green/30 rounded-lg p-3 text-center">
                <div className="text-xs font-bold text-vital-green uppercase mb-1 font-clinical">Cystic Duct ≥ 4mm</div>
                <div className="text-sm text-vital-green font-semibold">Choledochoscope-Assisted</div>
              </div>

              <div className="space-y-2 pl-4">
                <div className="bg-monitor-bg rounded p-2 border-l-2 border-vital-green">
                  <div className="text-xs font-semibold text-monitor-bright">Few Small Stones</div>
                  <div className="text-xs text-vital-green">→ Basket Extraction</div>
                </div>
                <div className="bg-monitor-bg rounded p-2 border-l-2 border-vital-amber">
                  <div className="text-xs font-semibold text-monitor-bright">Multiple / Medium (≤10mm)</div>
                  <div className="text-xs text-vital-amber">→ Balloon Sphincteroplasty + "Snow-Plow"</div>
                </div>
                <div className="bg-monitor-bg rounded p-2 border-l-2 border-vital-red">
                  <div className="text-xs font-semibold text-monitor-bright">Large Stone (&gt;10mm)</div>
                  <div className="text-xs text-vital-red">→ Lithotripsy (EHL/Laser)</div>
                </div>
              </div>
            </div>

            {/* Right Branch: Cystic Duct < 4mm */}
            <div className="space-y-3">
              <div className="bg-vital-amber/10 border border-vital-amber/30 rounded-lg p-3 text-center">
                <div className="text-xs font-bold text-vital-amber uppercase mb-1 font-clinical">Cystic Duct &lt; 4mm or Tortuous</div>
                <div className="text-sm text-vital-amber font-semibold">Fluoroscopy-Guided</div>
              </div>

              <div className="space-y-2 pl-4">
                <div className="bg-monitor-bg rounded p-2 border-l-2 border-vital-green">
                  <div className="text-xs font-semibold text-monitor-bright">Single Small Stone</div>
                  <div className="text-xs text-vital-green">→ Extraction Balloon (Push)</div>
                </div>
                <div className="bg-monitor-bg rounded p-2 border-l-2 border-vital-amber">
                  <div className="text-xs font-semibold text-monitor-bright">Multiple / Medium (≤10mm)</div>
                  <div className="text-xs text-vital-amber">→ Balloon Sphincteroplasty + Flush + Extraction Balloon</div>
                </div>
                <div className="bg-monitor-bg rounded p-2 border-l-2 border-vital-red">
                  <div className="text-xs font-semibold text-monitor-bright">Large Stone (&gt;10mm)</div>
                  <div className="text-xs text-vital-red">→ Lithotripsy (EHL/Laser)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Fallback Options */}
          <div className="mt-6 border-t border-monitor-border pt-4">
            <h3 className="text-sm font-bold text-vital-red vital-glow-red mb-3 text-center font-clinical">Fallback Options (If Primary Method Fails)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-monitor-bg rounded-lg p-3 border border-monitor-border">
                <div className="text-xs font-bold text-monitor-bright mb-2 font-clinical">Normal Anatomy</div>
                <ol className="space-y-1 text-xs text-monitor-text/60">
                  <li>1. Intraop ERCP (if available)</li>
                  <li>2. Stent if possible → Postop ERCP</li>
                  <li>3. Rendezvous ERCP (long wire)</li>
                </ol>
              </div>
              <div className="bg-monitor-bg rounded-lg p-3 border border-monitor-border">
                <div className="text-xs font-bold text-monitor-bright mb-2 font-clinical">Roux-en-Y Gastric Bypass</div>
                <ol className="space-y-1 text-xs text-monitor-text/60">
                  <li>1. Rendezvous Lap-Assisted ERCP (long wire)</li>
                  <li>2. If fails & CBD &gt;7mm → Transcholedochal Exploration</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Key Rules */}
          <div className="mt-4 bg-vital-cyan/5 border border-vital-cyan/20 rounded-lg p-3">
            <h4 className="text-xs font-bold text-vital-cyan mb-2 font-clinical">Key Rules</h4>
            <ul className="space-y-1 text-xs text-monitor-text/60">
              <li>• Balloon size ≤ distal CBD diameter; max recommended 12mm</li>
              <li>• Inflate to rated burst pressure, hold for 5 minutes</li>
              <li>• Always perform completion cholangiogram</li>
              <li>• Use 5mm reference (Olsen clamp) for measurements</li>
              <li>• Consider glucagon +/- saline flush for small stones at ampulla</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
