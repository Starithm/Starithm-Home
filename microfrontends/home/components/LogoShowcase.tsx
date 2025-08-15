import { Logo } from "./Logo";

export function LogoShowcase() {
  const featuredLogos = [
    { 
      name: 'Geometric S', 
      variant: 'geometric-s' as const, 
      description: 'Angular geometric "S" with glowing star bursts - inspired by constellation mapping'
    },
    { 
      name: 'Horologium', 
      variant: 'horologium' as const, 
      description: 'Based on the Clock constellation - representing precision and time in astronomical observations'
    },
    { 
      name: 'Pyxis', 
      variant: 'pyxis' as const, 
      description: 'Based on the Compass constellation - symbolizing navigation and guidance through the cosmos'
    }
  ];

  const alternativeLogos = [
    { 
      name: 'Stylized S', 
      variant: 'stylized-s' as const, 
      description: 'Letter "S" formed from orbital arcs and constellation lines'
    },
    { 
      name: 'Constellation', 
      variant: 'constellation' as const, 
      description: 'Connected stars forming a constellation pattern'
    },
    { 
      name: 'Orbital', 
      variant: 'orbital' as const, 
      description: 'Central star with orbital rings representing planetary motion'
    },
    { 
      name: 'Telescope', 
      variant: 'telescope' as const, 
      description: 'Observatory telescope with stars in the background'
    },
    { 
      name: 'Starburst', 
      variant: 'starburst' as const, 
      description: 'Radiating star with dynamic energy rays'
    },
    { 
      name: 'Stellar', 
      variant: 'stellar' as const, 
      description: 'Geometric star with gradient and accent elements'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-starithm-rich-black mb-6">
            Starithm Logo Options
          </h2>
          <p className="text-xl text-starithm-rich-black/70 max-w-3xl mx-auto">
            Choose from these minimal, astronomy-themed logo designs using our brand color palette
          </p>
        </div>

        {/* Hero logo - Geometric S */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-starithm-electric-violet text-center mb-12">
            Featured Design
          </h3>
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-50 rounded-3xl p-16 mb-8 border-2 border-gray-100 hover:border-starithm-electric-violet/30 transition-all duration-300">
              <div className="flex justify-center items-center space-x-8 mb-12">
                <Logo variant="geometric-s" size="sm" />
                <Logo variant="geometric-s" size="md" />
                <Logo variant="geometric-s" size="lg" />
              </div>
              
              {/* Large logo with text */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-16 h-16">
                  <Logo variant="geometric-s" className="w-full h-full" />
                </div>
                <span className="text-4xl font-bold text-starithm-electric-violet">
                  Starithm
                </span>
              </div>

              {/* On dark background preview */}
              <div className="bg-starithm-rich-black rounded-2xl p-8">
                <div className="flex items-center justify-center space-x-4">
                  <Logo variant="geometric-s" size="md" />
                  <span className="text-2xl font-bold text-starithm-electric-violet">
                    Starithm
                  </span>
                </div>
              </div>
            </div>
            
            <h4 className="text-3xl font-bold text-starithm-rich-black mb-4">
              Geometric S
            </h4>
            <p className="text-xl text-starithm-rich-black/70 leading-relaxed max-w-lg mx-auto">
              Angular geometric "S" with glowing star bursts at connection points - inspired by constellation mapping and astronomical precision
            </p>
          </div>
        </div>

        {/* Other astronomical logos */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-starithm-veronica text-center mb-12">
            Astronomical Constellation Inspired
          </h3>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {featuredLogos.slice(1).map((logo, index) => (
              <div key={index} className="text-center group">
                {/* Logo preview in different sizes */}
                <div className="bg-gray-50 rounded-2xl p-12 mb-6 border-2 border-gray-100 group-hover:border-starithm-veronica/30 transition-all duration-300">
                  <div className="flex justify-center items-center space-x-6 mb-8">
                    <Logo variant={logo.variant} size="sm" />
                    <Logo variant={logo.variant} size="md" />
                    <Logo variant={logo.variant} size="lg" />
                  </div>
                  
                  {/* With text */}
                  <div className="flex items-center justify-center space-x-3">
                    <Logo variant={logo.variant} size="md" />
                    <span className="text-2xl font-bold text-starithm-electric-violet">
                      Starithm
                    </span>
                  </div>
                </div>
                
                <h4 className="text-2xl font-bold text-starithm-rich-black mb-3">
                  {logo.name}
                </h4>
                <p className="text-starithm-rich-black/70 leading-relaxed">
                  {logo.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative designs */}
        <div>
          <h3 className="text-2xl font-bold text-starithm-selective-yellow text-center mb-12">
            Alternative Designs
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {alternativeLogos.map((logo, index) => (
              <div key={index} className="text-center group">
                {/* Logo preview */}
                <div className="bg-gray-50 rounded-xl p-8 mb-4 border border-gray-100 group-hover:border-starithm-selective-yellow/30 transition-all duration-300">
                  <div className="flex justify-center items-center mb-4">
                    <Logo variant={logo.variant} size="lg" />
                  </div>
                  
                  {/* With text */}
                  <div className="flex items-center justify-center space-x-2">
                    <Logo variant={logo.variant} size="sm" />
                    <span className="text-lg font-bold text-starithm-electric-violet">
                      Starithm
                    </span>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-starithm-rich-black mb-2">
                  {logo.name}
                </h4>
                <p className="text-sm text-starithm-rich-black/70 leading-relaxed">
                  {logo.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Color palette reference */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold text-starithm-rich-black mb-8">Brand Color Palette</h3>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-starithm-electric-violet rounded-full mx-auto mb-3"></div>
              <div className="text-sm text-starithm-rich-black/70">Electric Violet</div>
              <div className="text-xs text-starithm-rich-black/50">#770ff5</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-starithm-veronica rounded-full mx-auto mb-3"></div>
              <div className="text-sm text-starithm-rich-black/70">Veronica</div>
              <div className="text-xs text-starithm-rich-black/50">#A239CA</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-starithm-selective-yellow rounded-full mx-auto mb-3"></div>
              <div className="text-sm text-starithm-rich-black/70">Selective Yellow</div>
              <div className="text-xs text-starithm-rich-black/50">#FFB400</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-starithm-rich-black rounded-full mx-auto mb-3"></div>
              <div className="text-sm text-starithm-rich-black/70">Rich Black</div>
              <div className="text-xs text-starithm-rich-black/50">#0E0B16</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-starithm-platinum rounded-full mx-auto mb-3 border border-gray-200"></div>
              <div className="text-sm text-starithm-rich-black/70">Platinum</div>
              <div className="text-xs text-starithm-rich-black/50">#E7DFDD</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}