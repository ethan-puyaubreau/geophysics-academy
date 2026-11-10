(function(){ const R = String.raw;
COURSE.modules.push({
id:"seis", group:"Solid Earth", color:"seis", title:"Seismology", source:"Lecture 4 · HW2 · core seismology",
blurb:"Elastic waves and what they reveal about Earth's interior, the earthquake source, focal mechanisms, tsunami generation, and the instruments that watch it all.",
why:"Seismology is how we see inside the planet and how we measure earthquakes. Source physics connects to crustal deformation, and tsunamis connect earthquakes to the ocean-wave theory of the course.",
lessons:[
{id:"waves", title:"Elastic body and surface waves", mins:8, kind:"Core idea", summary:"P and S speeds from moduli; liquids carry no S; surface waves.",
 intro:"Momentum balance plus Hooke's law gives an elastic wave equation that splits into compressional (P) and shear (S) waves. Their speeds are set by stiffness over inertia, just as \(\sqrt{gH}\) was for water waves.",
 key:R`\[V_P=\sqrt{\frac{K+\tfrac43G}{\rho}},\qquad V_S=\sqrt{\frac G\rho},\qquad \frac{V_P}{V_S}=\sqrt3\ \ (\nu=0.25)\]`,
 sections:[
 {h:"Two body waves", b:R`<p>P waves compress and dilate in the direction of travel. S waves shear perpendicular to it and are always slower. In a fluid \(G=0\), so S waves vanish and \(V_P=\sqrt{K/\rho}\) (1.5 km/s in water). Crust: \(G=30\) GPa, \(K=50\) GPa, \(\rho=2700\), giving \(V_S\approx3.3\) and \(V_P\approx5.8\) km/s.</p>`},
 {h:"Surface waves", b:R`<p>Rayleigh waves (retrograde elliptical motion, ~0.92 \(V_S\)) and Love waves (horizontal shear trapped in layers) travel along the surface. They decay slowly with distance and carry the largest shaking far away. They are dispersive, which makes them a tool for imaging crust and upper mantle.</p>`},
 {h:"One structure, many waves", b:R`<p>Water waves: \(c^2=gH\). Flexural-gravity waves: \(c^2=gH+DHk^4/\rho\). Seismic waves: \(c^2=\text{modulus}/\rho\). In each case the restoring force (gravity, bending, elastic stiffness) sets the speed against inertia.</p>`}],
 examples:[{t:"Mantle shear speed", q:"G = 70 GPa, ρ = 3300 kg/m³. V_S?", s:R`\(\sqrt{7\times10^{10}/3300}=4.6\) km/s.`}],
 research:"Vp/Vs above ~1.8 beneath volcanoes or in subduction zones flags fluids or melt, since fluids reduce shear stiffness far more than bulk stiffness.",
 connects:["elasticity","rays","structure"]},
{id:"rays", title:"Rays, travel times and Earth's interior", mins:7, kind:"Core idea", summary:"Snell's law, S−P distance, Moho, core shadow zones.",
 intro:"Waves refract as speed changes with depth. Travel times recorded around the globe gave us the Moho, the liquid outer core and the solid inner core.",
 key:R`\[p=\frac{\sin i}{v}\ \text{(constant along a ray)},\qquad d\approx\frac{\Delta t_{S-P}}{1/V_S-1/V_P}\approx8\ \text{km/s}\times\Delta t\]`,
 sections:[
 {h:"Locating earthquakes", b:R`<p>S arrives after P by \(\Delta t=d(1/V_S-1/V_P)\). With crustal speeds, distance in km ≈ 8 × S−P time in seconds. Three stations triangulate an epicentre; many stations and a velocity model give depth and origin time.</p>`},
 {h:"Discoveries", b:R`<ul><li><b>Moho</b> (1909): a refracted head wave reveals the jump to ~8 km/s mantle.</li><li><b>Outer core</b>: no direct S beyond ~103° (liquid); a P shadow from 103° to 142° because P slows sharply in the core.</li><li><b>Inner core</b> (Lehmann, 1936): weak P arrivals inside the shadow zone reflect off a solid inner core.</li></ul>`}],
 examples:[{t:"Quick location", q:"S−P is 12 s. Distance?", s:"About 8 × 12 ≈ 100 km."}],
 research:"Tomography inverts millions of travel times for 3D velocity perturbations of a few percent, imaging slabs and plumes. Ambient-noise methods now image the crust without waiting for earthquakes.",
 connects:["waves","structure"]},
{id:"source", title:"The earthquake source: moment and magnitude", mins:9, kind:"Core idea", summary:"M₀ = μAD, Mw, stress drop, rupture duration.", widget:"magnitude", widgetAfter:1,
 intro:"An earthquake is slip on a fault. Its physical size is the seismic moment: rigidity times area times average slip. Magnitude is a logarithmic label for it.",
 key:R`\[M_0=\mu AD,\qquad M_w=\tfrac23\left(\log_{10}M_0-9.1\right)\ \ (M_0\ \text{in N m})\]`,
 sections:[
 {h:"Moment and magnitude", b:R`<p>Each magnitude unit is \(10^{1.5}\approx32\) times more moment (and roughly energy). Two units is 1000 times. Older magnitude scales saturate for great earthquakes; \(M_w\) does not, because it is tied to the physics.</p>`},
 {h:"Stress drop and scaling", b:R`<p>Static stress drop \(\Delta\sigma\approx C\mu D/L\), where \(L\) is rupture width or radius (circular crack: \(\Delta\sigma=\frac{7\pi}{16}\mu D/r\)). Observed values are 1–10 MPa over a huge range of sizes, so slip scales with rupture size and \(M_0\propto L^3\) for moderate events. Large megathrusts saturate in width and grow mainly in length.</p>`},
 {h:"Duration", b:R`<p>Ruptures propagate at ~0.8 \(V_S\) (2–3 km/s). An M6 lasts a few seconds; Tohoku (≈400 km) lasted about 150 s. That is fast compared with the time a tsunami takes to cross the source region.</p>`}],
 examples:[{t:"Tohoku", q:"μ = 30 GPa, rupture 400 × 200 km, average slip 15 m. Mw?", s:R`\(M_0=3\times10^{10}\times8\times10^{10}\times15=3.6\times10^{22}\) N m. \(M_w=\tfrac23(22.56-9.1)=9.0\).`}],
 research:"Finite-fault inversions combine seismograms, GNSS, InSAR, seafloor geodesy and tsunami records to map slip D(x, y). For Tohoku they showed up to ~50 m slip reaching the trench, which surprised many and explains the large tsunami.",
 oral:"What sets an earthquake's magnitude, and why do we use moment magnitude for great earthquakes?", connects:["cycle","tsunami","mechanisms"]},
{id:"mechanisms", title:"Focal mechanisms", mins:6, kind:"Core idea", summary:"First motions, nodal planes, beachballs, and the stress regime.",
 intro:"The pattern of first P motions around an earthquake tells you the fault orientation and slip direction, up to a two-fold ambiguity.",
 sections:[
 {h:"Quadrants", b:R`<p>Slip radiates compressional first motions in two quadrants and dilatational in the other two, separated by two perpendicular <b>nodal planes</b>: the fault plane and an auxiliary plane. Aftershocks, surface rupture or geology resolve which is which.</p>`},
 {h:"Reading beachballs", b:R`<p>Shaded regions are compressional (they contain the T axis); white regions are dilatational (they contain the P axis). <b>Thrust</b>: shaded centre. <b>Normal</b>: white centre. <b>Strike-slip</b>: a four-quadrant cross. P and T axes approximate σ1 and σ3 only roughly, because faults are rarely optimally oriented.</p>`},
 {h:"Beyond double couples", b:R`<p>Full moment tensors include isotropic (explosions, collapse) and CLVD components, common at volcanoes and in mines.</p>`}],
 research:"Global moment tensor catalogues are routinely inverted for regional stress, connecting earthquakes directly to Anderson's stress regimes.",
 connects:["anderson","source"]},
{id:"tsunami", title:"Tsunami generation by megathrust earthquakes", mins:11, kind:"Application", src:"Lecture 4 · HW2", summary:"Seafloor uplift becomes the initial condition; the wave splits; drawdown first on land.", widget:"tsunami", widgetAfter:2,
 intro:"A great subduction earthquake lifts and drops the seafloor over a region about 100 km wide in about 100 s. Because that is fast and water is incompressible, the sea surface copies the seafloor, and linear shallow-water theory does the rest.",
 key:R`\[\eta(x,0)=b(x)\ \ \text{if}\ \ \frac{c\tau}{\lambda}\ll1,\qquad \eta(x,t)=\tfrac12\eta_0(x-ct)+\tfrac12\eta_0(x+ct)\]`,
 sections:[
 {h:"Source", b:R`<p>Slip of ~10 m or more on the shallow plate interface produces the megathrust pattern: uplift above the slip near the trench, subsidence landward of a hinge line. Seafloor geodesy measured ~24 m horizontal and 3–5 m vertical motion offshore Miyagi in 2011.</p>`},
 {h:"When does the sea copy the seafloor? (HW2)", b:R`<p>Mass balance with a moving bottom: \(\partial_t\eta+\partial_x(Hu)=\partial_tb\). The flux term relative to the uplift term is \(\sim c\tau/\lambda\), where \(\tau\) is the deformation time. For Tohoku, \(200\times100/10^5=0.2\): small, so \(\eta\approx b\) at the end of the rupture, with \(u\approx0\). After that, \(\partial_tb=0\) and free propagation begins.</p>`},
 {h:"Splitting and what the coast sees", b:R`<ul><li>The initial shape splits into two half-amplitude waves travelling in opposite directions. In 1D linear theory the amplitude does not change.</li><li><b>Landward coast</b>: the subsidence lobe arrives first, so water recedes for minutes before the crest.</li><li><b>Seaward side</b>: uplift arrives first (as in India and Sri Lanka in 2004).</li><li>Wavelength ~100 km means periods of 10–20 min, unlike 10 s beach waves.</li><li>The largest uplift is often >100 km offshore, so the main wave arrives after ~10+ min: time for warnings.</li></ul>`},
 {h:"Approaching the shore", b:R`<p>Energy flux conservation gives Green's law, \(A\propto H^{-1/4}\). Nonlinearity and bathymetric focusing then raise run-up further; Tohoku reached ~40 m locally.</p>`}],
 examples:[{t:"Arrival time", q:"Coast 150 km from the uplift, mean depth 1.5 km. Travel time?", s:R`\(c=\sqrt{9.8\times1500}=121\) m/s, so \(1.5\times10^5/121\approx1240\) s ≈ 21 min.`}],
 mistakes:"Thinking a tsunami is a breaking wave in the open ocean. Offshore it is a ~1 m high, ~100 km long swell moving at 200 m/s that ships barely notice.",
 research:"Real-time tsunami warning now combines W-phase moment tensors, high-rate GNSS and offshore pressure sensors (S-net, DONET) to estimate seafloor uplift within minutes.",
 oral:"Why does the sea sometimes withdraw before a tsunami arrives, and where would you expect it to rise first instead?", connects:["linear","swe","energy","cycle","source"]},
{id:"observe", title:"Instruments: how we watch the solid Earth", mins:6, kind:"Reference", summary:"Seismometers, GNSS, InSAR, pressure gauges, gravity.",
 intro:"A model is only as useful as the data that test it. Match each instrument to the physical quantity and timescale it measures.",
 sections:[{h:"Toolbox", b:R`<div class="tscroll"><table class="t"><tr><th>Instrument</th><th>Measures</th><th>Timescale</th><th>Course link</th></tr>
 <tr><td>Broadband seismometer</td><td>ground velocity</td><td>0.01–50 Hz</td><td>waves, source</td></tr>
 <tr><td>GNSS</td><td>3D position, mm</td><td>1 s to decades</td><td>earthquake cycle, rebound</td></tr>
 <tr><td>InSAR</td><td>line-of-sight change (2.8 cm/fringe, C-band)</td><td>days to years</td><td>volcano inflation, subsidence</td></tr>
 <tr><td>Ocean-bottom pressure gauge</td><td>water column height (1 cm ≈ 100 Pa)</td><td>s to hours</td><td>tsunamis (Chile 2010)</td></tr>
 <tr><td>GNSS-acoustic seafloor geodesy</td><td>seafloor position</td><td>campaigns</td><td>Tohoku 24 m offset</td></tr>
 <tr><td>Tide gauge</td><td>sea level</td><td>minutes to centuries</td><td>tides, sea-level change</td></tr>
 <tr><td>Satellite gravity (GRACE)</td><td>mass change</td><td>monthly</td><td>ice loss, rebound</td></tr>
 <tr><td>Heat-flow probe, borehole</td><td>temperature gradient</td><td>static</td><td>geotherms, plate cooling</td></tr></table></div>`},
 {h:"Research habit", b:R`<p>For any proposed study, state which term in which equation the data constrain. "InSAR uplift constrains \(\Delta V/d^2\) of a Mogi source" is a much stronger sentence than "we will use InSAR".</p>`}],
 connects:["strain","mogi","tsunami"]}
],
problems:[
{id:"s1", lvl:1, skill:"Recall", type:"mc", lesson:"waves", q:"S waves cannot travel through:", choices:["Granite","Liquids","Ice","The lower mantle"], ans:1, sol:R`A liquid has zero shear modulus, so \(V_S=0\).`},
{id:"s2", lvl:2, skill:"Apply", type:"num", lesson:"waves", q:"V_S for G = 70 GPa, ρ = 3300 kg/m³ (km/s)?", ans:4.61, tol:.03, unit:"km/s", sol:R`\(\sqrt{7\times10^{10}/3300}=4.6\) km/s.`},
{id:"s3", lvl:2, skill:"Apply", type:"num", lesson:"rays", q:"S−P time 20 s, V_P = 6 km/s, V_S = 3.5 km/s. Distance?", ans:168, tol:.04, unit:"km", sol:R`\(1/3.5-1/6=0.119\) s/km, so \(20/0.119=168\) km.`},
{id:"s4", lvl:2, skill:"Apply", type:"num", lesson:"source", q:"Mw for μ = 30 GPa, L = 50 km, W = 15 km, D = 2 m?", ans:6.37, tol:.015, unit:"", sol:R`\(M_0=4.5\times10^{18}\) N m; \(\log_{10}=18.65\); \(M_w=\tfrac23(9.55)=6.37\).`},
{id:"s5", lvl:2, skill:"Recall", type:"num", lesson:"source", q:"How many times more moment does an Mw 8 release than an Mw 6?", ans:1000, tol:.05, unit:"×", sol:R`\(10^{1.5\times2}=1000\).`},
{id:"s6", lvl:2, skill:"Apply", type:"num", lesson:"tsunami", q:"Tsunami travel time over 600 km of 4 km deep ocean, in minutes?", ans:50.5, tol:.05, unit:"min", sol:R`\(c=198\) m/s, \(t=6\times10^5/198=3030\) s ≈ 50 min.`},
{id:"s7", lvl:3, skill:"Analyze", type:"mc", lesson:"tsunami", q:"For a megathrust earthquake, what does the coast landward of the rupture typically see first?", choices:["A sudden rise of sea level","A withdrawal (drawdown) of the sea","Nothing until the largest crest","A standing wave"], ans:1, sol:"Landward of the hinge line the seafloor subsides. That trough propagates to the coast first, so the sea recedes before the crest from the uplift zone arrives."},
{id:"s8", lvl:3, skill:"Scaling", type:"num", lesson:"tsunami", q:R`Check \(c\tau/\lambda\) for a slow 'tsunami earthquake': rupture time 200 s, source width 80 km, depth 3 km.`, ans:.43, tol:.06, unit:"", sol:R`\(c=171\) m/s. \(171\times200/8\times10^4=0.43\). Still below 1, but flux during rupture is no longer negligible; the initial sea surface is a smoothed version of the uplift.`},
{id:"s9", lvl:2, skill:"Interpret", type:"mc", lesson:"mechanisms", q:"A beachball with a shaded (compressional) centre indicates:", choices:["Normal faulting","Thrust faulting","Strike-slip faulting","An explosion"], ans:1, sol:"A shaded centre means the T axis is near vertical: thrust or reverse faulting."},
{id:"s10", lvl:3, skill:"Apply", type:"num", lesson:"source", q:"Stress drop of a circular crack, (7π/16)μD/r, for μ = 30 GPa, D = 1 m, r = 5 km?", ans:8.25, tol:.05, unit:"MPa", sol:R`\(1.374\times3\times10^{10}\times1/5000=8.2\) MPa.`},
{id:"s11", lvl:1, skill:"Recall", type:"num", lesson:"waves", q:"V_P/V_S for a Poisson solid (ν = 0.25)?", ans:1.732, tol:.01, unit:"", sol:R`\(\sqrt3\approx1.73\).`},
{id:"s12", lvl:3, skill:"Explain", type:"oral", lesson:"source", q:"Why does moment magnitude not saturate for great earthquakes while older magnitude scales do?", sol:"Older scales measure amplitude at a fixed period (e.g. 1 s or 20 s). Once a rupture is longer than the wavelength at that period, adding more fault length adds little amplitude at that period, so the scale saturates near M 7–8. Moment is the zero-frequency (static) level of the spectrum, μAD, which keeps growing with fault area and slip, so Mw keeps tracking size."}
]});
})();
