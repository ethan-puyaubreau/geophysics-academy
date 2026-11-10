(function(){ const R = String.raw;
COURSE.modules.push({
id:"found", group:"Start here", color:"found", title:"Earth Science Foundations", source:"Background for every module",
blurb:"The layered Earth, plate tectonics, the numbers you should know cold, and the scaling habits that make every later derivation shorter.",
why:"Panels and qualifying exams open with fundamentals. If you can produce a pressure, a timescale or a speed from memory and say which physics sets it, you can sanity-check any model or dataset in seconds, and you sound like someone who has done research.",
lessons:[
{id:"structure", title:"Earth's layered interior", mins:7, kind:"Core idea", summary:"Crust, mantle, core; lithosphere vs asthenosphere; how we know.",
 intro:"Earth's radius is 6371 km, but everything you can touch lives in the top 0.5%. The rest is known from seismic waves, gravity and the planet's bulk density.",
 key:R`Two ways to slice the Earth: by <b>composition</b> (crust, mantle, core) and by <b>mechanical behaviour</b> (lithosphere, asthenosphere, liquid outer core, solid inner core).`,
 sections:[
 {h:"The layers", b:R`<div class="tscroll"><table class="t"><tr><th>Layer</th><th>Depth (km)</th><th>Density (kg/m³)</th><th>State and notes</th></tr>
 <tr><td>Oceanic crust</td><td class="n">0–7</td><td class="n">~2900</td><td>basalt and gabbro, made at ridges</td></tr>
 <tr><td>Continental crust</td><td class="n">0–35 (70 under Tibet)</td><td class="n">~2750</td><td>buoyant, old, rarely subducted</td></tr>
 <tr><td>Upper mantle</td><td class="n">to 660</td><td class="n">3300–4000</td><td>peridotite; solid but creeps</td></tr>
 <tr><td>Lower mantle</td><td class="n">660–2890</td><td class="n">4400–5600</td><td>solid; convects over Myr</td></tr>
 <tr><td>Outer core</td><td class="n">2890–5150</td><td class="n">9900–12200</td><td>liquid Fe–Ni; generates the magnetic field</td></tr>
 <tr><td>Inner core</td><td class="n">5150–6371</td><td class="n">~13000</td><td>solid Fe–Ni</td></tr></table></div>`},
 {h:"Lithosphere is a mechanical layer", b:R`<p>The <b>lithosphere</b> is the cold, strong outer shell (crust plus uppermost mantle, roughly 100 km thick under old oceans) that behaves elastically over millions of years and moves as rigid plates. Its base is roughly an isotherm (about 1300 °C, or ~1600 K in the course notes). Beneath it, the hotter <b>asthenosphere</b> flows like a very viscous fluid. The Moho is a different boundary: a compositional jump from crust to mantle, seen as P-wave speed rising from about 6.5 to 8 km/s.</p><p>This distinction shows up throughout the course. Flexure (Lecture 9) treats the lithosphere as an elastic plate on a fluid mantle; plate cooling (Lecture 11) explains why that plate thickens with age.</p>`},
 {h:"How we know", b:R`<ul><li><b>Mean density</b> \(\bar\rho = 3M_E/(4\pi a^3)\approx 5500\) kg/m³, about twice that of surface rocks, so the interior must hold something dense (iron).</li><li><b>Moment of inertia</b> \(I/(Ma^2)=0.33\), less than 0.4 for a uniform sphere, so mass is concentrated toward the centre.</li><li><b>Seismology:</b> S waves cannot cross the outer core because a liquid has zero shear modulus. That creates an S-wave shadow beyond about 103° from an earthquake.</li></ul>`}],
 examples:[{t:"Earth's mean density", q:R`Use \(M_E=6.0\times10^{24}\) kg and \(a=6371\) km.`, s:R`\(V=\tfrac43\pi a^3 = 1.08\times10^{21}\) m³, so \(\bar\rho = 5.5\times10^3\) kg/m³. Crustal rock is ~2700 kg/m³, and self-compression alone cannot double the density, so the planet needs an iron core.`}],
 research:"Seismic tomography maps 1–2% velocity anomalies relative to a reference Earth model (PREM). A slow region usually means hot rock, melt or fluids. That is the starting point for plume and slab studies.",
 oral:"How do we know the outer core is liquid?", connects:["waves","rays","isostasy","lithcool"]},
{id:"plates", title:"Plate tectonics in one page", mins:6, kind:"Core idea", summary:"Boundary types, plate speeds, driving forces.",
 intro:"Plate tectonics is the kinematic framework of the solid Earth: rigid plates moving centimetres per year, with nearly all earthquakes, volcanoes and mountain building concentrated at their edges.",
 key:R`Plates move at 1–10 cm/yr, about \(10^{-9}\) m/s. Over 1 Myr, 5 cm/yr is 50 km.`,
 sections:[
 {h:"Three kinds of boundary", b:R`<ul><li><b>Divergent</b> (mid-ocean ridges, rifts): normal faults, decompression melting, new lithosphere.</li><li><b>Convergent</b> (subduction zones, collisions): thrust faults, megathrust earthquakes, arc volcanoes fed by water-fluxed melting.</li><li><b>Transform</b> (San Andreas, North Anatolian): strike-slip faults, no creation or destruction of plate.</li></ul>`},
 {h:"What drives them", b:R`<p>Plates are the cold top boundary layer of mantle convection. <b>Slab pull</b>, the negative buoyancy of old, cold, dense lithosphere sinking at trenches, is the largest force. <b>Ridge push</b> is a horizontal pressure-gradient force from elevated young seafloor; the course derives about \(4\times10^{12}\) N/m, or ~40 MPa spread over 100 km (Lecture 11). Resisting forces include friction on plate boundaries and viscous drag at the base.</p>`},
 {h:"Seafloor as a recorder", b:R`<p>Oceanic lithosphere is never older than ~180 Myr because it subducts. As it cools it contracts and sinks isostatically, so ocean depth increases as \(\sqrt{\text{age}}\): roughly \(d\approx 2.5\ \text{km} + 0.35\ \text{km}\,\sqrt{t/\text{Myr}}\). The <a href="#les-lithcool">plate cooling lesson</a> derives this.</p>`}],
 examples:[{t:"Plate travel", q:"The Pacific plate moves ~8 cm/yr toward Japan. How much plate is consumed at the trench in 10 Myr?", s:R`\(0.08\ \text{m/yr}\times10^7\ \text{yr}=8\times10^5\) m = 800 km of lithosphere.`}],
 research:"GNSS velocities are precise to better than 1 mm/yr. The deviations from rigid-plate motion near boundaries are the elastic strain that loads faults, which is the subject of the earthquake-cycle lesson.",
 oral:"What drives plate motion, and how would you estimate the size of the dominant force?", connects:["lithcool","cycle","melting"]},
{id:"numbers", title:"Numbers every geophysicist carries", mins:8, kind:"Reference", summary:"Order-of-magnitude values to memorise to one significant figure.",
 intro:"Fast estimates need a mental table of constants. Memorise these to one significant figure, together with the reason each one matters.",
 sections:[{h:"The table", b:R`<div class="tscroll"><table class="t"><tr><th>Quantity</th><th>Value</th><th>Why you care</th></tr>
 <tr><td>Gravity g</td><td class="n">9.8 ≈ 10 m/s²</td><td>every buoyancy and pressure</td></tr>
 <tr><td>Earth radius a; mass</td><td class="n">6371 km; 6×10²⁴ kg</td><td>tides, scale ratios</td></tr>
 <tr><td>Moon mass; distance</td><td class="n">7.35×10²² kg; 3.85×10⁵ km</td><td>tidal forcing</td></tr>
 <tr><td>Earth rotation Ω</td><td class="n">7.3×10⁻⁵ s⁻¹</td><td>tides, Coriolis</td></tr>
 <tr><td>Densities: water, ice, crust, mantle</td><td class="n">1000, 917, 2700–2900, 3300</td><td>isostasy, flexure</td></tr>
 <tr><td>Lithostatic gradient ρg</td><td class="n">≈27 MPa/km (rock), 10 MPa/km (water)</td><td>pressure at depth</td></tr>
 <tr><td>Atmosphere: p₀, scale height</td><td class="n">0.1 MPa; 8 km</td><td>Lecture 1a</td></tr>
 <tr><td>Shear modulus μ (crust, mantle)</td><td class="n">30 GPa, 70 GPa</td><td>seismic moment, elasticity</td></tr>
 <tr><td>Young's modulus E (rock, ice)</td><td class="n">70–100 GPa; ~10 GPa</td><td>flexure</td></tr>
 <tr><td>Vp, Vs (crust)</td><td class="n">6, 3.5 km/s</td><td>locating earthquakes</td></tr>
 <tr><td>Plate speed</td><td class="n">1–10 cm/yr ≈ 10⁻⁹ m/s</td><td>loading rates</td></tr>
 <tr><td>Mantle viscosity</td><td class="n">10²¹ Pa s</td><td>rebound, convection</td></tr>
 <tr><td>Magma viscosity (basalt → rhyolite)</td><td class="n">10–10² → 10⁶–10¹⁰ Pa s</td><td>eruption style</td></tr>
 <tr><td>Thermal diffusivity κ</td><td class="n">10⁻⁶ m²/s</td><td>cooling, √(κt)</td></tr>
 <tr><td>Thermal conductivity k</td><td class="n">3–4 W/(m K)</td><td>heat flow</td></tr>
 <tr><td>Surface heat flow</td><td class="n">~70 mW/m² (46 TW total)</td><td>geotherms</td></tr>
 <tr><td>Thermal expansivity α</td><td class="n">3×10⁻⁵ K⁻¹</td><td>buoyancy, subsidence</td></tr>
 <tr><td>Earthquake stress drop</td><td class="n">1–10 MPa</td><td>source scaling</td></tr>
 <tr><td>Rock friction coefficient</td><td class="n">0.6–0.85</td><td>fault strength</td></tr>
 <tr><td>1 year</td><td class="n">π×10⁷ s</td><td>unit conversions</td></tr>
 <tr><td>Ocean depth</td><td class="n">~4 km</td><td>c = √(gH) ≈ 200 m/s</td></tr></table></div>`},
 {h:"How to use it", b:R`<p>Keep one significant figure and track powers of ten. Most exam arithmetic reduces to \(10^a\times10^b\). Say your answer with units and a comparison: "about 1 GPa, ten thousand atmospheres."</p>`}],
 research:"Order-of-magnitude checks catch modelling bugs. If a simulation gives a mantle velocity of 1 m/yr, the viscosity or buoyancy in the code is wrong.",
 connects:["scaling","timescales"]},
{id:"scaling", title:"Scaling and dominant balance", mins:9, kind:"Method", src:"Lectures 1a, 2–3, 5", summary:"Nondimensional ratios decide which terms you can drop.",
 intro:"The most reused skill in this course: before solving an equation, estimate each term's size, find the ratios, and keep only the terms that matter.",
 key:"Scale it before you solve it. Replace each derivative by a characteristic size, form ratios of terms, and drop those much smaller than 1.",
 sections:[
 {h:"Small parameters you have already met", b:R`<ul><li>\(H/r\sim10^{-3}\): atmospheric scale height over Earth radius, so the atmosphere can be treated as flat (Lecture 1a).</li><li>\(A/H\sim10^{-4}\): a 1 m wave against an 8 km scale height, so air pressure is uniform over the wave.</li><li>\(a/R\approx1/60\): Earth radius over Earth–Moon distance, which lets you Taylor-expand the tidal force.</li><li>\(|\eta|/H\ll1\): small-amplitude waves, which lets you linearise the shallow-water equations.</li><li>\(\alpha/\lambda\): flexural length over load width, which decides between isostasy and elastic support.</li></ul>`},
 {h:"The recipe", b:R`<p>Replace \(\partial/\partial t\to1/T\) and \(\partial/\partial x\to1/L\), and every variable by its scale (\(U, A, \Delta p\)). For shallow-water waves (Lecture 2–3): pressure difference \(\Delta p\sim\rho gA\), so acceleration \(\sim gA/\lambda\). Velocity gained over a period is \(u\sim gAT/\lambda\). The mass moved, \(\rho uTH\), must equal the mass raised, \(\rho\lambda A\). That gives \((\lambda/T)^2\sim gH\), so \(c\sim\sqrt{gH}\) with no differential equation solved.</p>`},
 {h:"Dominant balance", b:R`<p>When an equation has three terms, look for limits where one is negligible. In the tide problem (Lecture 5), the ratio of inertia to pressure gradient is \((a\Omega/c)^2\). If it is small, the tide is in <b>equilibrium</b> (pressure balances tidal force). If it is large, the tide is <b>inertial</b> (acceleration balances tidal force). In Rayleigh–Taylor instability (Lecture 13), \(\lambda/b\) picks which geometry limits the flow.</p>`},
 {h:"Famous numbers", b:R`<div class="tscroll"><table class="t"><tr><th>Number</th><th>Ratio</th><th>Geophysical use</th></tr>
 <tr><td>Reynolds \(\rho UL/\mu\)</td><td>inertia / viscous</td><td>mantle ~10⁻²¹: inertia irrelevant (Stokes flow)</td></tr>
 <tr><td>Péclet \(UL/\kappa\)</td><td>advection / diffusion</td><td>whether plates carry heat or conduct it</td></tr>
 <tr><td>Rayleigh \(\rho g\alpha\Delta T L^3/(\kappa\mu)\)</td><td>buoyancy / (viscosity × diffusion)</td><td>mantle ~10⁷: vigorous convection</td></tr>
 <tr><td>\(a\Omega/c\)</td><td>tidal sweep speed / wave speed</td><td>inverted vs equilibrium tides</td></tr>
 <tr><td>\((\alpha/\lambda)^4\)</td><td>bending / buoyancy</td><td>flexure vs isostasy</td></tr>
 <tr><td>Deborah \(\tau_M/t_{obs}\)</td><td>relaxation time / observation time</td><td>elastic vs viscous behaviour</td></tr></table></div>`}],
 examples:[{t:"Reynolds number of the mantle", q:R`Estimate \(Re\) for mantle convection: \(\rho=3300\) kg/m³, \(U=3\) cm/yr, \(L=1000\) km, \(\mu=10^{21}\) Pa s.`, s:R`\(U\approx10^{-9}\) m/s, so \(Re=3300\times10^{-9}\times10^6/10^{21}\approx3\times10^{-21}\). Inertia is utterly negligible. Mantle flow is Stokes flow, and the force balance holds instantaneously. Lectures 12 and 13 drop the acceleration terms for exactly this reason.`}],
 research:"The first move in a modelling paper is to nondimensionalise and identify the controlling numbers. Then you know what a lab analogue or simulation must match, and which regime your field area is in.",
 oral:"Give three dimensionless numbers from geophysics, and for each say what physical regime it decides.", connects:["swe","tides","pgr","rt","flexure"]},
{id:"timescales", title:"Timescales: elastic or viscous, diffusing or waving", mins:7, kind:"Core idea", src:"Lectures 10, 12", summary:"Maxwell time and the √(κt) diffusion length.",
 intro:"Whether rock rings like a bell or flows like honey depends on how long you watch. Whether a signal travels or diffuses depends on the physics: waves cover distance ∝ t, diffusion covers ∝ √t.",
 key:R`Maxwell time \(\tau_M=\mu_{visc}/G\) (viscosity over shear modulus). Diffusion length \(\ell\sim\sqrt{\kappa t}\).`,
 sections:[
 {h:"Maxwell time", b:R`<p>A material with viscosity \(\mu\) and shear modulus \(G\) responds elastically to loads shorter than \(\tau_M=\mu/G\) and viscously to longer ones. For the mantle: \(10^{21}/(7\times10^{10})\approx1.4\times10^{10}\) s, about 450 years. Seismic waves (seconds) see an elastic solid; post-glacial rebound (thousands of years) and convection (millions) see a fluid. These observations are consistent.</p>`},
 {h:"Diffusion length", b:R`<p>Heat, momentum (viscosity) and pore pressure all diffuse. A change at a boundary penetrates a distance \(\sim\sqrt{\kappa t}\) (Lecture 10 uses \(2\sqrt{\kappa t}\) for the erfc solution). With \(\kappa=10^{-6}\) m²/s: one day gives ~30 cm (why daily temperature swings vanish a short way into soil), one year ~5.6 m, 1 Myr ~5.6 km, 100 Myr ~56 km (the thickness of old lithosphere). Periodic forcing with frequency \(\omega\) penetrates \(\sqrt{2\kappa/\omega}\).</p><p>Contrast with waves: a tsunami travels \(ct\). The notes stress this difference: for diffusion, distance is proportional to √time.</p>`}],
 examples:[{t:"Cooling a sill", q:"How long does a 100 m thick basaltic sill take to cool substantially?", s:R`Use the half-thickness: \(t\sim L^2/\kappa=(50\ \text{m})^2/10^{-6}=2.5\times10^9\) s, roughly 80 years. A 1 km sill takes 100 times longer, about 8000 years.`}],
 research:"Postseismic deformation that decays over years to decades after great earthquakes is viscoelastic relaxation of the lower crust and mantle. Fitting it with Maxwell rheologies is one of the main ways to measure mantle viscosity.",
 oral:"The mantle transmits shear waves yet convects. Resolve the apparent contradiction.", connects:["heat","pgr","constitutive","poro"]}
],
problems:[
{id:"f1", lvl:1, skill:"Recall", type:"mc", lesson:"structure", q:"Which observation most directly shows that Earth's outer core is liquid?", choices:["S waves do not pass through it","Earth's mean density exceeds crustal density","Lava erupts as a liquid","The geotherm exceeds 1000 °C at 100 km"], ans:0, hints:["What elastic property does a liquid lack?"], sol:R`A liquid has zero shear modulus, so \(V_S=\sqrt{\mu/\rho}=0\). The S-wave shadow beyond ~103° shows the outer core cannot transmit shear. The density argument shows a dense core, not a liquid one.`},
{id:"f2", lvl:1, skill:"Recall", type:"mc", lesson:"structure", q:"Which layer moves as rigid tectonic plates?", choices:["Crust only","Lithosphere (crust plus uppermost mantle)","Asthenosphere","Lower mantle"], ans:1, sol:"The lithosphere is defined mechanically: the cold, strong layer that behaves elastically over geological time. It includes the crust and the uppermost mantle."},
{id:"f3", lvl:2, skill:"Estimate", type:"num", lesson:"plates", q:"A plate moves at 5 cm/yr. How far does it travel in 2 Myr?", ans:100, tol:.05, unit:"km", hints:["Convert cm/yr to km/Myr: 1 cm/yr = 10 km/Myr."], sol:R`5 cm/yr = 50 km/Myr, so 2 Myr gives 100 km.`},
{id:"f4", lvl:2, skill:"Apply", type:"num", lesson:"plates", q:R`Using \(d\approx2500+350\sqrt{t}\) m with \(t\) in Myr, how deep is 25 Myr-old seafloor?`, ans:4250, tol:.03, unit:"m", sol:R`\(\sqrt{25}=5\), so \(d=2500+1750=4250\) m.`},
{id:"f5", lvl:2, skill:"Estimate", type:"num", lesson:"timescales", q:R`Mantle viscosity \(10^{21}\) Pa s, shear modulus 70 GPa. Maxwell time in years?`, ans:453, tol:.15, unit:"yr", hints:[R`\(\tau_M=\mu/G\); 1 yr ≈ \(3.15\times10^7\) s.`], sol:R`\(10^{21}/7\times10^{10}=1.43\times10^{10}\) s, which is about 450 yr.`},
{id:"f6", lvl:2, skill:"Estimate", type:"num", lesson:"timescales", q:R`Diffusion length \(\sqrt{\kappa t}\) for heat (\(\kappa=10^{-6}\) m²/s) after 10 Myr, in km?`, ans:17.7, tol:.15, unit:"km", sol:R`\(t=3.15\times10^{14}\) s, so \(\sqrt{3.15\times10^{8}}\approx1.8\times10^4\) m, about 18 km.`},
{id:"f7", lvl:3, skill:"Scaling", type:"mc", lesson:"scaling", q:"The Reynolds number of mantle convection is of order:", choices:[R`\(10^{-20}\)`,"1",R`\(10^{3}\)`,R`\(10^{8}\)`], ans:0, sol:R`\(\rho UL/\mu\approx3300\times10^{-9}\times10^6/10^{21}\approx3\times10^{-21}\). Inertia is negligible, so the momentum equation reduces to the Stokes equations, a balance of pressure, viscous stress and buoyancy.`},
{id:"f8", lvl:3, skill:"Explain", type:"oral", lesson:"timescales", q:"A classmate says post-glacial rebound proves the mantle is a fluid, while seismic S waves prove it is a solid. Resolve this in three sentences.", sol:R`<p>Rock is viscoelastic, and the Maxwell time \(\tau_M=\mu/G\approx450\) yr separates the two behaviours. Seismic waves load the mantle for seconds, far shorter than \(\tau_M\), so it responds elastically and transmits shear. Ice loads last thousands of years, much longer than \(\tau_M\), so the mantle flows and rebound records a viscosity of about \(10^{21}\) Pa s.</p>`},
{id:"f9", lvl:2, skill:"Apply", type:"num", lesson:"structure", q:R`Compute Earth's mean density from \(M=6.0\times10^{24}\) kg, \(a=6371\) km.`, ans:5520, tol:.04, unit:"kg/m³", sol:R`\(V=1.083\times10^{21}\) m³, so \(\rho=5.5\times10^3\) kg/m³.`}
]});
})();
