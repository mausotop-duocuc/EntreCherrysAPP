import React, { useState } from 'react';

function App() {
  const [cart, setCart] = useState([]);
  const [categoria, setCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [faqAbierto, setFaqAbierto] = useState(null);
  
  // Estado para el modal de personalización
  const [productoPersonalizando, setProductoPersonalizando] = useState(null);
  const [opcionesCustom, setOpcionesCustom] = useState({
    relleno: 'Manjar / LÚCUMA / Nuez',
    mensajeTorta: '',
    colorDetalle: 'Rosa Cereza',
    notasExtra: ''
  });

  const PHONE_NUMBER = "56912345678"; 
  const INSTAGRAM_USERNAME = "entrecherrys";

  const productos = [
    // --- TORTAS (Rutas desde la carpeta public/) ---
    { 
      id: 3, 
      nombre: "Torta Personalizada (15 Porciones)", 
      categoria: "tortas", 
      precio: 28000, 
      descripcion: "Bizcocho húmedo con relleno a elección y decoración artesanal con cerezas de la casa.", 
      imagen: "/torta-tradicional.jpg", 
      opcionesRelleno: ["Manjar / LÚCUMA / Nuez", "Chocolate / Frambuesa", "Tres Leches Tradicional", "Crema Chantilly / Frutilla"], 
      popular: true 
    },
    { 
      id: 4, 
      nombre: "Torta Especial Eventos Premium", 
      categoria: "tortas", 
      precio: 45000, 
      descripcion: "Torta gourmet con cubierta fina de chocolate, frutos rojos y cerezas seleccionadas.", 
      imagen: "/torta-eventos.jpg", 
      opcionesRelleno: ["Manjar / LÚCUMA / Nuez", "Chocolate / Frambuesa", "Nutella / Oreo", "Crema Pastelera / Durazno"],
      popular: true
    },

    // --- AMIGURUMIS ---
    { id: 1, nombre: "Oso Tejido Tradicional", categoria: "amigurumi", precio: 15000, descripcion: "Oso clásico tejido a mano con hilo de algodón 100% hipoalergénico y relleno suave.", imagen: "https://images.unsplash.com/photo-1558679908-541bcf1249ff?auto=format&fit=crop&q=80&w=400", popular: true },
    { id: 5, nombre: "Conejita de Apego Floral", categoria: "amigurumi", precio: 16500, descripcion: "Conejita suave ideal para bebés con detalles bordados a mano y vestido removible.", imagen: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400" },
    { id: 6, nombre: "Gatito Amigurumi Curioso", categoria: "amigurumi", precio: 14000, descripcion: "Adorable gatito tejido con bufanda personalizable del color que prefieras.", imagen: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&q=80&w=400" },
    { id: 7, nombre: "Zorrito del Bosque Crochet", categoria: "amigurumi", precio: 17000, descripcion: "Simpático zorro color terracota tejido con finas terminaciones artesanales.", imagen: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=400" },
    { id: 8, nombre: "Muñeca 'Cerecita' Personalizada", categoria: "amigurumi", precio: 22000, descripcion: "Muñeca tejida a mano con peinado y ropa a elección. Un recuerdo eterno.", imagen: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?auto=format&fit=crop&q=80&w=400", popular: true },
    { id: 9, nombre: "Perrito Corgi Mini", categoria: "amigurumi", precio: 13500, descripcion: "Tierno perrito compacto de 15 cm perfecto para escritorios o repisas.", imagen: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400" },
    { id: 10, nombre: "Dinosaurio T-Rex Kawaii", categoria: "amigurumi", precio: 18000, descripcion: "Dinosaurio verde en estilo amigurumi supersuave con ojos de seguridad.", imagen: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=400" },
    
    // --- ROPA ---
    { id: 2, nombre: "Polerón Personalizado Entre Cherrys", categoria: "ropa", precio: 22000, descripcion: "Polerón de franela bordado a mano con diseño exclusivo.", imagen: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=400" }
  ];

  const testimonios = [
    { id: 1, nombre: "Camila R.", comentario: "La torta de cumpleaños quedó hermosa y exquisita. ¡Súper detallistas!", estrellas: 5, producto: "Torta Personalizada" },
    { id: 2, nombre: "Ignacio M.", comentario: "El amigurumi de regalo llegó precioso y con empaque de regalo muy lindo.", estrellas: 5, producto: "Amigurumi a Pedido" },
    { id: 3, nombre: "Valentina S.", comentario: "Atención súper amable por WhatsApp y cumplieron con la fecha exacta.", estrellas: 5, producto: "Polerón Bordado" }
  ];

  const preguntasFrecuentes = [
    { p: "¿Con cuánta anticipación debo pedir?", r: "Aconsejamos reservar con 3-5 días para tortas y 5-7 días para amigurumis o textil. Aceptamos máximo 2 entregas por día." },
    { p: "¿Cómo se realiza el pago?", r: "Solicitamos el 50% de abono por transferencia para congelar el cupo en agenda. El saldo restante se liquida al entregar." },
    { p: "¿Dónde entregan?", r: "Ofrecemos retiro presencial y envíos/despachos a domicilio previa coordinación por WhatsApp." }
  ];

  const abrirModalPersonalizacion = (prod) => {
    setProductoPersonalizando(prod);
    setOpcionesCustom({
      relleno: prod.opcionesRelleno ? prod.opcionesRelleno[0] : '',
      mensajeTorta: '',
      colorDetalle: 'Rosa Cereza',
      notasExtra: ''
    });
  };

  const confirmarPersonalizacion = () => {
    if (!productoPersonalizando) return;
    
    const productoConDetalles = {
      ...productoPersonalizando,
      detallesCustom: { ...opcionesCustom },
      cartId: Date.now()
    };

    setCart([...cart, productoConDetalles]);
    setToastMessage(`¡${productoPersonalizando.nombre} agregado con tus opciones! 🍒`);
    setProductoPersonalizando(null);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const eliminarDelCarrito = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const productosFiltrados = productos.filter(p => {
    const coincideCategoria = categoria === 'todos' || p.categoria === categoria;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                             p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const totalPrecio = cart.reduce((acc, item) => acc + item.precio, 0);
  const abonoRequerido = totalPrecio * 0.5;

  const enviarPedidoWhatsApp = () => {
    if (cart.length === 0) return;

    let mensaje = "¡Hola Entre Cherrys! 🍒 Quisiera agendar la siguiente solicitud:\n\n";
    cart.forEach((item, index) => {
      mensaje += `*${index + 1}. ${item.nombre}* - $${item.precio.toLocaleString('es-CL')}\n`;
      if (item.detallesCustom) {
        if (item.detallesCustom.relleno) mensaje += `   • Relleno: ${item.detallesCustom.relleno}\n`;
        if (item.detallesCustom.mensajeTorta) mensaje += `   • Texto/Mensaje: "${item.detallesCustom.mensajeTorta}"\n`;
        if (item.detallesCustom.colorDetalle) mensaje += `   • Tono preferido: ${item.detallesCustom.colorDetalle}\n`;
        if (item.detallesCustom.notasExtra) mensaje += `   • Nota especial: ${item.detallesCustom.notasExtra}\n`;
      }
      mensaje += `\n`;
    });

    if (fechaEntrega) {
      mensaje += `📅 *Fecha requerida de entrega:* ${fechaEntrega}\n`;
    }

    mensaje += `\n💰 *Total estimado:* $${totalPrecio.toLocaleString('es-CL')}`;
    mensaje += `\n✨ *Abono 50% requerido:* $${abonoRequerido.toLocaleString('es-CL')}`;
    mensaje += `\n\n¿Cuentan con cupo disponible para esta fecha?`;

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen font-sans bg-rose-50/40 text-gray-800 flex flex-col justify-between relative selection:bg-rose-200 selection:text-rose-900">
      
      {/* NAVEGACIÓN SUPERIOR */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 font-serif italic">
              Entre Cherrys 🍒
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href={`https://instagram.com/${INSTAGRAM_USERNAME}`}
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full hover:bg-rose-100 transition"
            >
              <span>📷 @{INSTAGRAM_USERNAME}</span>
            </a>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm active:scale-95"
            >
              <span>🛒 Mi Pedido</span>
              {cart.length > 0 && (
                <span className="bg-white text-rose-600 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-inner">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* BANNER AVISO */}
      <div className="bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100 text-rose-900 text-xs font-medium py-2 px-4 text-center border-b border-rose-200/60 flex items-center justify-center gap-2">
        <span className="animate-pulse">🌸</span>
        <span>Agenda abierta para esta semana • Reserva tu cupo con <strong>50% de abono</strong></span>
      </div>

      {/* BANNER PRINCIPAL (FOTO LIMPIA SIN FILTRO DE COLOR) */}
      <section 
        className="relative bg-cover bg-center text-white py-20 px-4 shadow-inner overflow-hidden"
        style={{
          backgroundImage: "url('/banner-hilos.jpg')"
        }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="bg-gray-900/75 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-4 shadow-md backdrop-blur-sm border border-white/20">
            Repostería Fina & Confección Artesanal ✨
          </span>
          
          <h1 className="text-4xl md:text-6xl font-black font-serif italic mb-4 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)] text-white">
            Dulzura y cariño hechos a mano
          </h1>
          
          <p className="text-white text-sm md:text-base font-semibold max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-black/40 p-3 rounded-2xl backdrop-blur-xs border border-white/10">
            Cada creación de Entre Cherrys está diseñada para hacer tus fechas especiales inolvidables.
          </p>

          <div className="max-w-xl mx-auto relative shadow-2xl rounded-2xl overflow-hidden bg-white/95 p-1.5 border border-rose-200">
            <input 
              type="text"
              placeholder="🔍 Buscar por 'Oso', 'Torta', 'Dinosaurio'..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-5 py-3.5 bg-white text-gray-800 rounded-xl text-sm focus:outline-none shadow-inner placeholder-gray-400 font-medium"
            />
          </div>
        </div>
      </section>

      {/* FILTROS DE CATEGORÍA */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'todos', label: '✨ Todos los Productos', count: productos.length },
            { id: 'amigurumi', label: '🧶 Amigurumis Tejidos', count: 7 },
            { id: 'tortas', label: '🎂 Tortas Personalizadas', count: 2 },
            { id: 'ropa', label: '👕 Vestuario', count: 1 }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoria(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm border ${
                categoria === cat.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-rose-200 scale-105'
                  : 'bg-white text-gray-600 border-rose-100 hover:bg-rose-50'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </section>

      {/* REJILLA DE PRODUCTOS */}
      <main className="max-w-6xl mx-auto px-4 py-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-white/90 backdrop-blur-md rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-rose-100/80 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative overflow-hidden h-56">
                  <img 
                    src={prod.imagen} 
                    alt={prod.nombre} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {prod.popular && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      ⭐ Destacado
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 leading-snug group-hover:text-rose-600 transition">
                    {prod.nombre}
                  </h3>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                    {prod.descripcion}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-rose-50/60 mt-2">
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-rose-600">${prod.precio.toLocaleString('es-CL')}</span>
                    <span className="text-[10px] text-rose-500 font-medium block">
                      Abono 50%: ${(prod.precio / 2).toLocaleString('es-CL')}
                    </span>
                  </div>

                  <button
                    onClick={() => abrirModalPersonalizacion(prod)}
                    className="bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 font-bold px-4 py-2.5 rounded-2xl transition text-xs shadow-sm active:scale-95 flex items-center gap-1.5"
                  >
                    <span>🎨 Personalizar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* SECCIÓN ARTESANAL DESTACADA */}
      <section className="bg-gradient-to-b from-white to-rose-50/60 py-12 border-y border-rose-100">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <img 
              src="/proceso-artesanal.jpg" 
              alt="Proceso artesanal lana" 
              className="rounded-3xl shadow-xl object-cover h-72 w-full border-4 border-white"
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <span className="text-rose-500 text-xs font-bold uppercase tracking-widest">Compromiso de Calidad</span>
            <h2 className="text-3xl font-bold font-serif italic text-gray-800 mt-1 mb-3">
              Manos artesanas, materias primas de excelencia 🌸
            </h2>
            <p className="text-gray-600 text-xs leading-relaxed mb-4">
              En Entre Cherrys seleccionamos minuciosamente cada hilo, ingrediente y detalle. Nos dedicamos a que cada pieza tejida y cada receta horneada lleve un pedacito de dedicación.
            </p>
            <div className="flex justify-center md:justify-start gap-4 text-xs font-bold text-gray-700">
              <span className="bg-white px-3 py-1.5 rounded-xl border border-rose-100 shadow-sm">🧵 100% Hecho a mano</span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-rose-100 shadow-sm">🍒 Recetas exclusivas</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-12 max-w-5xl mx-auto px-4 text-center">
        <span className="text-rose-500 font-bold text-xs uppercase tracking-widest">Opiniones de Clientes</span>
        <h2 className="text-2xl font-bold text-gray-800 mt-1 mb-8 font-serif italic">Experiencias Cherrys ⭐</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {testimonios.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3 text-sm">
                  {"★".repeat(t.estrellas)}
                </div>
                <p className="text-gray-600 text-xs italic leading-relaxed">"{t.comentario}"</p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-50">
                <p className="font-bold text-xs text-gray-800">{t.nombre}</p>
                <span className="text-[10px] text-rose-500 font-medium">{t.producto}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-10 w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 font-serif italic">Preguntas Frecuentes 🤔</h2>
        <div className="space-y-3">
          {preguntasFrecuentes.map((item, index) => (
            <div key={index} className="bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setFaqAbierto(faqAbierto === index ? null : index)}
                className="w-full text-left p-4 font-semibold text-gray-800 flex justify-between items-center text-xs md:text-sm focus:outline-none hover:bg-rose-50/50 transition"
              >
                <span>{item.p}</span>
                <span className="text-rose-500 font-bold text-lg">{faqAbierto === index ? "−" : "+"}</span>
              </button>
              {faqAbierto === index && (
                <div className="p-4 pt-0 text-xs text-gray-600 border-t border-rose-50 bg-rose-50/20 leading-relaxed">
                  {item.r}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-rose-100/60 to-rose-200/80 border-t border-rose-200 py-10 text-center text-gray-600 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <p className="font-serif italic text-2xl text-rose-600 font-bold mb-1">Entre Cherrys 🍒</p>
          <p className="text-gray-500 max-w-sm">Repostería fina & Confección Artesanal</p>

          <div className="flex gap-4 mt-4 text-xs font-semibold text-rose-700">
            <a href={`https://instagram.com/${INSTAGRAM_USERNAME}`} target="_blank" rel="noreferrer" className="hover:underline">📷 Instagram</a>
            <span>•</span>
            <a href={`https://wa.me/${PHONE_NUMBER}`} target="_blank" rel="noreferrer" className="hover:underline">💬 WhatsApp</a>
          </div>

          <p className="mt-6 pt-4 border-t border-rose-200/60 text-[10px] text-rose-800/80">
            © 2026 Entre Cherrys • Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* MODAL PERSONALIZACIÓN */}
      {productoPersonalizando && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-rose-100">
              <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                <span>🎨 Personalizar:</span>
                <span className="text-rose-600">{productoPersonalizando.nombre}</span>
              </h3>
              <button 
                onClick={() => setProductoPersonalizando(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {productoPersonalizando.categoria === 'tortas' && (
                <>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Elige el Relleno:</label>
                    <select 
                      value={opcionesCustom.relleno}
                      onChange={(e) => setOpcionesCustom({...opcionesCustom, relleno: e.target.value})}
                      className="w-full p-2.5 border border-rose-200 rounded-xl bg-rose-50/40 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                    >
                      {productoPersonalizando.opcionesRelleno?.map((r, i) => (
                        <option key={i} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mensaje en la Torta (opcional):</label>
                    <input 
                      type="text" 
                      placeholder="Ej: ¡Feliz Cumpleaños Sofía! 🎉"
                      value={opcionesCustom.mensajeTorta}
                      onChange={(e) => setOpcionesCustom({...opcionesCustom, mensajeTorta: e.target.value})}
                      className="w-full p-2.5 border border-rose-200 rounded-xl bg-rose-50/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </>
              )}

              {productoPersonalizando.categoria !== 'tortas' && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Color o Tono Preferido:</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Tonos pastel, Bufanda roja..."
                    value={opcionesCustom.colorDetalle}
                    onChange={(e) => setOpcionesCustom({...opcionesCustom, colorDetalle: e.target.value})}
                    className="w-full p-2.5 border border-rose-200 rounded-xl bg-rose-50/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Notas especiales:</label>
                <textarea 
                  rows="2"
                  placeholder="Instrucciones adicionales..."
                  value={opcionesCustom.notasExtra}
                  onChange={(e) => setOpcionesCustom({...opcionesCustom, notasExtra: e.target.value})}
                  className="w-full p-2.5 border border-rose-200 rounded-xl bg-rose-50/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  onClick={confirmarPersonalizacion}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-2xl shadow-lg transition text-sm"
                >
                  Añadir al Pedido (${productoPersonalizando.precio.toLocaleString('es-CL')})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CARRITO LATERAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end transition">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl relative">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-rose-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span>🛒 Mi Reserva</span>
                </h3>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-3">🛍️</span>
                  <p className="text-gray-500 font-medium text-sm">Tu lista está vacía.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3 max-h-[48vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.cartId} className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100 flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <img src={item.imagen} alt={item.nombre} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-xs text-gray-800">{item.nombre}</h4>
                          <span className="text-xs font-black text-rose-600 block">${item.precio.toLocaleString('es-CL')}</span>
                          
                          {item.detallesCustom && (
                            <div className="mt-1 text-[10px] text-gray-500 space-y-0.5">
                              {item.detallesCustom.relleno && <p>• Relleno: {item.detallesCustom.relleno}</p>}
                              {item.detallesCustom.mensajeTorta && <p>• Texto: "{item.detallesCustom.mensajeTorta}"</p>}
                              {item.detallesCustom.colorDetalle && <p>• Tono: {item.detallesCustom.colorDetalle}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => eliminarDelCarrito(item.cartId)}
                        className="text-red-400 hover:text-red-600 text-xs p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-rose-100">
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    📅 Fecha requerida para tu pedido:
                  </label>
                  <input 
                    type="date" 
                    value={fechaEntrega}
                    onChange={(e) => setFechaEntrega(e.target.value)}
                    className="w-full bg-rose-50/50 border border-rose-200 text-gray-800 p-2.5 rounded-xl text-xs font-medium focus:outline-none"
                  />
                </div>

                <div className="space-y-1 text-xs mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Pedido:</span>
                    <span className="font-bold">${totalPrecio.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-bold text-sm bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    <span>Abono del 50%:</span>
                    <span>${abonoRequerido.toLocaleString('es-CL')}</span>
                  </div>
                </div>

                <button
                  onClick={enviarPedidoWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 text-sm"
                >
                  <span>💬 Enviar Reserva por WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NOTIFICACIÓN TOAST */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-gray-900/90 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-medium z-50 backdrop-blur-md">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;