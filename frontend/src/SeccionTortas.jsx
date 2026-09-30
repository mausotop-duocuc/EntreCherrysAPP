import React, { useState } from 'react';

export default function SeccionTortas({ onAgregarAlCarrito }) {
  // 1. CATÁLOGO CON TUS IMÁGENES REALES DE /PUBLIC
  const tortasCatalogo = [
    {
      id: 'torta-crema-clasica',
      nombre: 'Torta Crema Clásica & Cerezas',
      descripcion: 'Cobertura suave en tono menta con rosetones de crema rosa y cerezas frescas en la copa.',
      precio: 22990,
      imagen: '/torta crema clasica.jpg',
      porciones: '10 a 12 porciones',
      popular: true
    },
    {
      id: 'torta-cumpleanos-dino',
      nombre: 'Torta Cumpleaños Dinosaurios',
      descripcion: 'Torta infantil temática de 3 pisos moldeada con adorables figuras de dinosaurios.',
      precio: 45000,
      imagen: '/Torta cumpeaños.jpg',
      porciones: '25 a 30 porciones',
      popular: true
    },
    {
      id: 'torta-cumpleanos-jardin',
      nombre: 'Torta Cumpleaños Jardín Dulce',
      descripcion: 'Diseño infantil de 3 pisos en tonos pastel decorado con pajaritos, mariposas y flores.',
      precio: 45000,
      imagen: '/Torta cumpleaños 2.jpg',
      porciones: '25 a 30 porciones',
      popular: false
    },
    {
      id: 'torta-eventos-berries',
      nombre: 'Torta Eventos Chocolate & Berries',
      descripcion: 'Borde rústico de chocolate artesanal cargada con abundantes frutos rojos y physalis frescos.',
      precio: 32990,
      imagen: '/torta-eventos.jpg',
      porciones: '15 a 20 porciones',
      popular: true
    },
    {
      id: 'torta-tradicional-drip',
      nombre: 'Torta Tradicional Manjar Drip',
      descripcion: 'Clásica torta con chorreado de manjar, rosetones de crema, galletas Oreo y cerezas.',
      precio: 24990,
      imagen: '/torta-tradicional.jpg',
      porciones: '12 a 15 porciones',
      popular: false
    }
  ];

  // 2. ESTADOS DEL FORMULARIO DE PERSONALIZACIÓN
  const [tamaño, setTamaño] = useState('10 personas');
  const [bizcocho, setBizcocho] = useState('Vainilla Tradicional');
  const [relleno, setRelleno] = useState('Manjar con Lúcuta');
  const [cobertura, setCobertura] = useState('Buttercream de Vainilla Suave');
  const [mensaje, setMensaje] = useState('');
  const [tonos, setTonos] = useState('');
  const [detalles, setDetalles] = useState('');

  const preciosPorTamaño = {
    '10 personas': 18000,
    '15 personas': 25000,
    '20 personas': 32000,
    '30 personas': 45000,
  };

  const handleAgregarCatalogo = (torta) => {
    if (onAgregarAlCarrito) {
      onAgregarAlCarrito({
        ...torta,
        categoria: 'tortas',
        cartId: Date.now()
      });
    }
  };

  const handleAgregarPersonalizada = (e) => {
    e.preventDefault();
    const nuevaTorta = {
      id: `torta-custom-${Date.now()}`,
      cartId: Date.now(),
      nombre: `Torta Personalizada (${tamaño})`,
      precio: preciosPorTamaño[tamaño] || 20000,
      categoria: 'tortas',
      imagen: '/torta crema clasica.jpg',
      detallesCustom: {
        tamaño,
        bizcocho,
        relleno,
        cobertura,
        mensajeTorta: mensaje,
        colorDetalle: tonos,
        notasExtra: detalles
      }
    };

    if (onAgregarAlCarrito) {
      onAgregarAlCarrito(nuevaTorta);
    }
  };

  return (
    <div className="space-y-12">
      
      {/* 🍰 GALERÍA DE MODELOS REALES */}
      <div>
        <div className="mb-6 text-center sm:text-left">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">
            Nuestras Especialidades
          </span>
          <h3 className="text-2xl font-serif font-bold text-rose-950 italic">
            Catálogo de Tortas 🎂
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Elige uno de nuestros modelos estrella o personaliza la tuya desde cero más abajo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tortasCatalogo.map((torta) => (
            <div 
              key={torta.id}
              className="bg-white/80 backdrop-blur-xs rounded-3xl border border-rose-100/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div>
                <div className="relative h-56 bg-rose-50 overflow-hidden">
                  <img 
                    src={torta.imagen} 
                    alt={torta.nombre} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {torta.popular && (
                    <span className="absolute top-3 left-3 bg-rose-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs">
                      ⭐ Más Pedida
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-white/90 text-rose-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs">
                    {torta.porciones}
                  </span>
                </div>

                <div className="p-5">
                  <h4 className="font-bold text-stone-800 text-base group-hover:text-rose-600 transition">
                    {torta.nombre}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    {torta.descripcion}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block">PRECIO</span>
                  <span className="font-serif font-bold text-rose-700 text-xl">
                    ${torta.precio.toLocaleString('es-CL')}
                  </span>
                </div>
                <button
                  onClick={() => handleAgregarCatalogo(torta)}
                  className="bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs"
                >
                  🛒 Añadir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎨 SECCIÓN COZY: PERSONALIZA TU TORTA */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-50/90 via-amber-50/50 to-pink-50/80 p-6 md:p-10 border border-rose-100/70 shadow-lg shadow-rose-100/20 font-sans">
        
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-rose-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 bg-rose-100/80 text-rose-700 text-[11px] font-semibold px-3.5 py-1 rounded-full tracking-wider uppercase backdrop-blur-xs border border-rose-200/50 mb-3 shadow-xs">
              ✨ Repostería Artesanal
            </span>
            <h2 className="text-3xl md:text-4xl font-serif italic text-rose-950 font-normal tracking-wide">
              Personaliza tu Torta
            </h2>
            <p className="text-amber-900/70 text-xs md:text-sm mt-2 max-w-md mx-auto font-light leading-relaxed">
              Elige cada sabor y detalle con el cariño y la dedicación que merecen tus momentos especiales 🎂✨
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-rose-100/80 shadow-md bg-white/85 backdrop-blur-[2px]">
            <form 
              onSubmit={handleAgregarPersonalizada} 
              className="relative z-10 p-6 md:p-8 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-rose-950 mb-2">
                    1. Tamaño de la Torta 🍰
                  </label>
                  <select 
                    value={tamaño}
                    onChange={(e) => setTamaño(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-rose-200 rounded-2xl text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-300 transition shadow-xs"
                  >
                    <option value="10 personas">10 Porciones ($18.000)</option>
                    <option value="15 personas">15 Porciones ($25.000)</option>
                    <option value="20 personas">20 Porciones ($32.000)</option>
                    <option value="30 personas">30 Porciones ($45.000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-950 mb-2">
                    2. Bizcocho Favorito 🧁
                  </label>
                  <select 
                    value={bizcocho}
                    onChange={(e) => setBizcocho(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-rose-200 rounded-2xl text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-300 transition shadow-xs"
                  >
                    <option value="Vainilla Tradicional">Vainilla Tradicional</option>
                    <option value="Chocolate Intenso">Chocolate Intenso</option>
                    <option value="Red Velvet">Red Velvet</option>
                    <option value="Zanahoria & Nueces">Zanahoria & Nueces</option>
                    <option value="Amapola & Limón">Amapola & Limón</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-rose-950 mb-2">
                    3. Relleno Principal 🍯
                  </label>
                  <select 
                    value={relleno}
                    onChange={(e) => setRelleno(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-rose-200 rounded-2xl text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-300 transition shadow-xs"
                  >
                    <option value="Manjar con Lúcuta">Manjar con Lúcuta</option>
                    <option value="Manjar & Nueces">Manjar & Nueces</option>
                    <option value="Crema Pastelera & Frambuesas">Crema Pastelera & Frambuesas</option>
                    <option value="Ganache de Chocolate & Frutillas">Ganache de Chocolate & Frutillas</option>
                    <option value="Crema Chantilly & Durazno">Crema Chantilly & Durazno</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-950 mb-2">
                    4. Cobertura o Estilo 🎨
                  </label>
                  <select 
                    value={cobertura}
                    onChange={(e) => setCobertura(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-rose-200 rounded-2xl text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-300 transition shadow-xs"
                  >
                    <option value="Buttercream de Vainilla Suave">Buttercream de Vainilla Suave</option>
                    <option value="Merengue Italiano">Merengue Italiano Doradito</option>
                    <option value="Naked Cake (Semi desnuda)">Naked Cake (Rústico Chic)</option>
                    <option value="Ganache de Chocolate">Ganache de Chocolate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-950 mb-2">
                  5. Texto o Dedicatoria en la Torta ✍️ <span className="text-gray-400 font-normal">(Opcional)</span>
                </label>
                <input 
                  type="text"
                  placeholder='Ej: "¡Feliz Cumple Mamá!", "25 Aniversario"'
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 border border-rose-200 rounded-2xl text-xs text-gray-700 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 transition shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-rose-950 mb-2">
                    6. Paleta de Colores Preferida 🌸
                  </label>
                  <input 
                    type="text"
                    placeholder="Ej: Pastel rosa y crema, Lilas..."
                    value={tonos}
                    onChange={(e) => setTonos(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-rose-200 rounded-2xl text-xs text-gray-700 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 transition shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-950 mb-2">
                    7. Detalles o Temática Extra 🍓
                  </label>
                  <input 
                    type="text"
                    placeholder="Ej: Flores de crema, frutillas frescas..."
                    value={detalles}
                    onChange={(e) => setDetalles(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-rose-200 rounded-2xl text-xs text-gray-700 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 transition shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-rose-200/60 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[11px] text-amber-900/60 font-medium uppercase tracking-wider block">Valor estimado:</span>
                  <span className="text-2xl font-serif font-semibold text-rose-700">
                    ${(preciosPorTamaño[tamaño] || 20000).toLocaleString('es-CL')}
                  </span>
                </div>

                <button 
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>🍒 Añadir Torta al Pedido</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>
    </div>
  );
}