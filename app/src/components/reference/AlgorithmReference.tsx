interface Props {
  onClose: () => void;
}

export function AlgorithmReference({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-xl border border-slate-600 max-w-4xl w-full max-h-[90vh] overflow-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-blue-400">LRCP Algorithm</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">&times;</button>
        </div>

        {/* Algorithm Flowchart as styled divs */}
        <div className="space-y-4">
          {/* Entry */}
          <div className="text-center">
            <div className="inline-block bg-blue-900/50 border border-blue-600 rounded-lg px-4 py-2 text-sm font-semibold text-blue-200">
              IOC: Assess Cystic Duct & Stone Burden
            </div>
          </div>

          {/* Branch */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-0.5 h-6 bg-slate-600 mx-auto" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Branch: Cystic Duct >= 4mm */}
            <div className="space-y-3">
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-center">
                <div className="text-xs font-bold text-green-400 uppercase mb-1">Cystic Duct ≥ 4mm</div>
                <div className="text-sm text-green-200 font-semibold">Choledochoscope-Assisted</div>
              </div>

              <div className="space-y-2 pl-4">
                <div className="bg-slate-700/50 rounded p-2 border-l-2 border-green-600">
                  <div className="text-xs font-semibold text-slate-200">Few Small Stones</div>
                  <div className="text-xs text-green-400">→ Basket Extraction</div>
                </div>
                <div className="bg-slate-700/50 rounded p-2 border-l-2 border-amber-600">
                  <div className="text-xs font-semibold text-slate-200">Multiple / Medium (≤10mm)</div>
                  <div className="text-xs text-amber-400">→ Balloon Sphincteroplasty + "Snow-Plow"</div>
                </div>
                <div className="bg-slate-700/50 rounded p-2 border-l-2 border-red-600">
                  <div className="text-xs font-semibold text-slate-200">Large Stone (&gt;10mm)</div>
                  <div className="text-xs text-red-400">→ Lithotripsy (EHL/Laser)</div>
                </div>
              </div>
            </div>

            {/* Right Branch: Cystic Duct < 4mm */}
            <div className="space-y-3">
              <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3 text-center">
                <div className="text-xs font-bold text-amber-400 uppercase mb-1">Cystic Duct &lt; 4mm or Tortuous</div>
                <div className="text-sm text-amber-200 font-semibold">Fluoroscopy-Guided</div>
              </div>

              <div className="space-y-2 pl-4">
                <div className="bg-slate-700/50 rounded p-2 border-l-2 border-green-600">
                  <div className="text-xs font-semibold text-slate-200">Single Small Stone</div>
                  <div className="text-xs text-green-400">→ Extraction Balloon (Push)</div>
                </div>
                <div className="bg-slate-700/50 rounded p-2 border-l-2 border-amber-600">
                  <div className="text-xs font-semibold text-slate-200">Multiple / Medium (≤10mm)</div>
                  <div className="text-xs text-amber-400">→ Balloon Sphincteroplasty + Flush + Extraction Balloon</div>
                </div>
                <div className="bg-slate-700/50 rounded p-2 border-l-2 border-red-600">
                  <div className="text-xs font-semibold text-slate-200">Large Stone (&gt;10mm)</div>
                  <div className="text-xs text-red-400">→ Lithotripsy (EHL/Laser)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Fallback Options */}
          <div className="mt-6 border-t border-slate-600 pt-4">
            <h3 className="text-sm font-bold text-red-400 mb-3 text-center">Fallback Options (If Primary Method Fails)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <div className="text-xs font-bold text-slate-300 mb-2">Normal Anatomy</div>
                <ol className="space-y-1 text-xs text-slate-400">
                  <li>1. Intraop ERCP (if available)</li>
                  <li>2. Stent if possible → Postop ERCP</li>
                  <li>3. Rendezvous ERCP (long wire)</li>
                </ol>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <div className="text-xs font-bold text-slate-300 mb-2">Roux-en-Y Gastric Bypass</div>
                <ol className="space-y-1 text-xs text-slate-400">
                  <li>1. Rendezvous Lap-Assisted ERCP (long wire)</li>
                  <li>2. If fails & CBD &gt;7mm → Transcholedochal Exploration</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Key Rules */}
          <div className="mt-4 bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
            <h4 className="text-xs font-bold text-blue-400 mb-2">Key Rules</h4>
            <ul className="space-y-1 text-xs text-slate-400">
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
