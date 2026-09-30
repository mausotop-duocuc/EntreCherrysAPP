import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import SeccionTortas from './SeccionTortas';

// 1. CONEXIÓN A SUPABASE
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-anon-key-aqui';

let supabase = null;
try {
  if (SUPABASE_URL.startsWith('http')) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn("Supabase no configurado, utilizando productos locales.");
}

function App() {
  const [cart, setCart] = useState([]);
  const [categoria, setCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [faqAbierto, setFaqAbierto] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // CATÁLOGO CON PRECIOS Y OPCIONES ACTUALIZADAS
  const productosLocales = [
    {
      id: 1,
      nombre: "Amigurumi Capibara",
      descripcion: "Adorable capibara tejida a crochet con detalle de naranjita en la cabeza.",
      precio: 9990,
      categoria: "amigurumi",
      imagen: "/amigurumis/Amigurumi Capibara.jpeg",
      popular: true,
      soloColor: true
    },
    {
      id: 2,
      nombre: "Amigurumi Oso Pijama",
      descripcion: "Osito tierno confeccionado a mano con pijama y gorrito tejido de dormir.",
      precio: 9990,
      categoria: "amigurumi",
      imagen: "/amigurumis/Amigurumi oso pijama.jpeg",
      popular: true,
      soloColor: true
    },
    {
      id: 3,
      nombre: "Amigurumi Personalizado",
      descripcion: "Muñeco tejido totalmente a pedido según fotos, ropa o personajes que elijas.",
      precio: 13990,
      categoria: "amigurumi",
      imagen: "/amigurumis/Amigurumi personalizado.jpeg",
      popular: true,
      soloColor: false
    },
    {
      id: 4,
      nombre: "Amigurumi Llavero Ratita",
      descripcion: "Llavero compacto de carita de ratita gris con moño rosa hecho a crochet.",
      precio: 9990,
      categoria: "amigurumi",
      imagen: "/amigurumis/Amigurumi Ratita.jpeg",
      popular: false,
      soloColor: true
    },
    {
      id: 5,
      nombre: "Amigurumi Vaquita Velvet",
      descripcion: "Vaquita super suave en hilo tipo velvet con mantita tejida de accesorio.",
      precio: 9990,
      categoria: "amigurumi",
      imagen: "/amigurumis/Amigurumi vaquita.jpeg",
      popular: true,
      soloColor: true
    },
    {
      id: 6,
      nombre: "Amigurumi Zorro",
      descripcion: "Zorrito detallado tejido a mano en tonos naranja, blanco y café.",
      precio: 9990,
      categoria: "amigurumi",
      imagen: "/amigurumis/Amigurumi zorro.jpeg",
      popular: false,
      soloColor: true
    },
    {
      id: 8,
      nombre: "Polerón Bordado Artesanal",
      descripcion: "Polerón personalizado con bordado confeccionado a mano.",
      precio: 22000,
      categoria: "ropa",
      imagen: "/poleron.jpg",
      soloColor: false
    }
  ];

  // CARGA DE PRODUCTOS
  useEffect(() => {
    async function cargarProductos() {
      if (!supabase) {
        setProductos(productosLocales);
        setCargando(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('productos').select('*');
        if (error || !data || data.length === 0) {
          setProductos(productosLocales);
        } else {
          const formateados = data.map(p => ({
            ...p,
            opcionesRelleno: p.opciones_relleno || p.opcionesRelleno
          }));
          setProductos(formateados);
        }
      } catch (err) {
        console.error("Error al consultar Supabase:", err);
        setProductos(productosLocales);
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  // ESTADOS Y HANDLERS DE PERSONALIZACIÓN
  const [productoPersonalizando, setProductoPersonalizando] = useState(null);
  const [opcionesCustom, setOpcionesCustom] = useState({
    relleno: '',
    mensajeTorta: '',
    colorDetalle: 'Original',
    accesorio: 'Sin accesorio',
    notasExtra: ''
  });

  const PHONE_NUMBER = "56912345678"; 
  const INSTAGRAM_USERNAME = "entrecherrys";

  const testimonios = [
    { id: 1, nombre: "Camila R.", comentario: "La torta de cumpleaños quedó hermosa y exquisita. ¡Súper detallistas!", estrellas: 5, producto: "Torta Personalizada" },
    { id: 2, nombre: "Ignacia M.", comentario: "El amigurumi de regalo llegó precioso y con empaque de regalo muy lindo.", estrellas: 5, producto: "Amigurumi a Pedido" },
    { id: 3, nombre: "Valentina S.", comentario: "Atención súper amable por WhatsApp y cumplieron con la fecha exacta.", estrellas: 5, producto: "Polerón Bordado" }
  ];

  const preguntasFrecuentes = [
    { p: "¿Con cuánta anticipación debo pedir?", r: "Aconsejamos reservar con 3-5 días para tortas y 5-7 días para amigurumis o textil." },
    { p: "¿Cómo se realiza el pago?", r: "Solicitamos el 50% de abono por transferencia para congelar el cupo en agenda." },
    { p: "¿Dónde entregan?", r: "Ofrecemos retiro presencial y envíos a domicilio previa coordinación." }
  ];

  const abrirModalPersonalizacion = (prod) => {
    setProductoPersonalizando(prod);
    setOpcionesCustom({
      relleno: prod.opcionesRelleno ? prod.opcionesRelleno[0] : '',
      mensajeTorta: '',
      colorDetalle: prod.colorElegido || 'Original',
      accesorio: prod.accesorioElegido || 'Sin accesorio',
      notasExtra: prod.detallesPersonalizados || ''
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
    setToastMessage(`¡${productoPersonalizando.nombre} agregado! 🍒`);
    setProductoPersonalizando(null);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const eliminarDelCarrito = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const productosFiltrados = productos.filter(p => {
    const coincideCategoria = categoria === 'todos' || p.categoria?.toLowerCase() === categoria.toLowerCase();
    const coincideBusqueda = p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
                             p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const totalPrecio = cart.reduce((acc, item) => acc + (Number(item.precio) || 0), 0);
  const abonoRequerido = totalPrecio * 0.5;

  const enviarPedidoWhatsApp = () => {
    if (cart.length === 0) return;
    let mensaje = "¡Hola Entre Cherrys! 🍒 Quisiera agendar la siguiente solicitud:\n\n";
    cart.forEach((item, index) => {
      mensaje += `*${index + 1}. ${item.nombre}* - $${Number(item.precio || 0).toLocaleString('es-CL')}\n`;
      if (item.detallesCustom) {
        if (item.detallesCustom.relleno) mensaje += `   • Relleno: ${item.detallesCustom.relleno}\n`;
        if (item.detallesCustom.mensajeTorta) mensaje += `   • Texto/Mensaje: "${item.detallesCustom.mensajeTorta}"\n`;
        if (item.detallesCustom.colorDetalle) mensaje += `   • Color/Tono: ${item.detallesCustom.colorDetalle}\n`;
        if (item.detallesCustom.notasExtra) mensaje += `   • Detalle personalizado: ${item.detallesCustom.notasExtra}\n`;
      }
    });
    if (fechaEntrega) mensaje += `\n📅 *Fecha requerida:* ${fechaEntrega}\n`;
    mensaje += `\n💰 *Total:* $${totalPrecio.toLocaleString('es-CL')}`;
    mensaje += `\n✨ *Abono 50%:* $${abonoRequerido.toLocaleString('es-CL')}`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen text-gray-800 flex flex-col justify-between font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-rose-600 font-serif italic">Entre Cherrys 🍒</span>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href={`https://instagram.com/${INSTAGRAM_USERNAME}`} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-500 hover:text-rose-500 text-xs font-semibold hidden sm:block transition"
            >
              @{INSTAGRAM_USERNAME}
            </a>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg transition text-sm flex items-center gap-2"
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

      {/* BANNER PRINCIPAL CON FONDO DE IMAGEN */}
      <section 
        className="relative bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400 bg-cover bg-center text-white py-20 px-4 shadow-md"
        style={{ backgroundImage: "url('/banner-hilos.jpg')" }}
      >
        <div className="absolute inset-0 bg-rose-950/40 backdrop-blur-[1px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/30 inline-block mb-3">
            Creaciones a Mano & Personalizadas
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-serif italic mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]">
            Dulzura y cariño hechos a mano
          </h1>
          <p className="text-rose-100 text-sm md:text-base max-w-xl mx-auto mb-6 font-medium">
            Amigurumis únicos, repostería artesanal y bordados especiales pensados para regalar o regalonearte.
          </p>

          <div className="max-w-xl mx-auto bg-white/95 p-1.5 rounded-2xl shadow-xl border border-rose-200">
            <input 
              type="text"
              placeholder="🔍 Buscar por producto, amigurumi, torta..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2.5 bg-transparent text-gray-800 placeholder-gray-400 rounded-xl text-sm focus:outline-none font-medium"
            />
          </div>
        </div>
      </section>

      {/* FILTROS DE CATEGORÍA */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap justify-center gap-2">
          {['todos', 'amigurumi', 'tortas', 'ropa'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-5 py-2 rounded-2xl text-xs font-bold capitalize transition-all border shadow-sm ${
                categoria === cat 
                  ? 'bg-rose-600 text-white border-rose-600 shadow-rose-200 shadow-md' 
                  : 'bg-white text-gray-600 border-rose-100 hover:bg-rose-50 hover:border-rose-200'
              }`}
            >
              {cat === 'todos' ? '✨ Todos los productos' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL Y CATÁLOGO */}
      <main className="max-w-6xl mx-auto px-4 py-8 w-full">

        {/* 🍰 1. SECCIÓN DE TORTAS (SE MUESTRA SI LA CATEGORÍA ES 'TODOS' O 'TORTAS') */}
        {(categoria === 'todos' || categoria === 'tortas') && (
          <div className="mb-12">
            <SeccionTortas />
          </div>
        )}

        {/* 🧸 2. CATÁLOGO DE AMIGURUMIS Y ROPA (SE MUESTRA CUANDO NO SEA SOLO 'TORTAS') */}
        {categoria !== 'tortas' && (
          <>
            {cargando ? (
              <div className="text-center text-rose-600 font-medium py-16 flex flex-col items-center gap-2">
                <span className="animate-spin text-3xl">🍒</span>
                <p className="text-sm">Cargando creaciones...</p>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 max-w-md mx-auto p-6">
                <span className="text-4xl">🔍</span>
                <p className="text-gray-600 font-bold mt-2">No se encontraron productos</p>
                <p className="text-gray-400 text-xs mt-1">Prueba buscando con otro término o cambiando la categoría.</p>
              </div>
            ) : (
              <div>
                {categoria === 'todos' && (
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold font-serif text-gray-800">🧸 Amigurumis & Bordados</h3>
                    <p className="text-gray-500 text-xs">Figuras tejidas a mano y ropa personalizada</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productosFiltrados.map((prod) => (
                    <div 
                      key={prod.id} 
                      className="bg-white rounded-3xl shadow-sm border border-rose-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="relative overflow-hidden h-52 bg-rose-50">
                          <img 
                            src={prod.imagen} 
                            alt={prod.nombre} 
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          {prod.popular && (
                            <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                              ⭐ Favorito
                            </span>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-gray-800 text-base group-hover:text-rose-600 transition">{prod.nombre}</h3>
                          </div>
                          <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{prod.descripcion}</p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 flex items-center justify-between mt-2">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block">PRECIO</span>
                          <span className="font-black text-rose-600 text-xl">${Number(prod.precio || 0).toLocaleString('es-CL')}</span>
                        </div>
                        <button 
                          onClick={() => abrirModalPersonalizacion(prod)}
                          className="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm"
                        >
                          {prod.soloColor ? '🎨 Elegir Color' : '🎨 Personalizar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* SECCIÓN TESTIMONIOS */}
        <section className="mt-16 bg-white rounded-3xl p-6 md:p-8 border border-rose-100 shadow-sm">
          <div className="text-center mb-8">
            <span className="text-rose-500 font-bold text-xs uppercase tracking-widest">Lo que dicen nuestras clientas</span>
            <h2 className="text-2xl font-black font-serif italic text-gray-800 mt-1">Experiencias Cherrys 🍒</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonios.map((t) => (
              <div key={t.id} className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/60 flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 text-xs mb-2">
                    {"★".repeat(t.estrellas)}
                  </div>
                  <p className="text-gray-600 text-xs italic">"{t.comentario}"</p>
                </div>
                <div className="mt-4 pt-2 border-t border-rose-100/80 flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-xs">{t.nombre}</span>
                  <span className="text-[10px] text-rose-500 font-semibold bg-white px-2 py-0.5 rounded-full border border-rose-100">{t.producto}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN PREGUNTAS FRECUENTES (FAQ) */}
        <section className="mt-12 max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Preguntas Frecuentes 💬</h2>
          </div>
          <div className="space-y-3">
            {preguntasFrecuentes.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-sm">
                <button
                  onClick={() => setFaqAbierto(faqAbierto === idx ? null : idx)}
                  className="w-full text-left p-4 font-bold text-xs md:text-sm text-gray-700 flex justify-between items-center hover:bg-rose-50/50 transition"
                >
                  <span>{faq.p}</span>
                  <span className="text-rose-500 text-lg">{faqAbierto === idx ? '−' : '+'}</span>
                </button>
                {faqAbierto === idx && (
                  <div className="p-4 pt-0 text-xs text-gray-500 leading-relaxed border-t border-rose-50 bg-rose-50/20">
                    {faq.r}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-rose-100/60 border-t border-rose-200 py-8 text-center text-gray-600 text-xs mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-rose-600 text-sm italic font-serif">Entre Cherrys 🍒</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Amigurumis & Repostería Artesanal</p>
          </div>
          <p className="text-[11px] text-gray-500">© 2026 Entre Cherrys • Todos los derechos reservados.</p>
          
          {/* SECCIÓN DE REDES SOCIALES Y CONTACTO */}
          <div className="flex items-center justify-center space-x-4 py-2">
            {/* Botón de WhatsApp */}
            <a
              href={`https://wa.me/${PHONE_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full font-semibold transition-all shadow-md hover:scale-105 text-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Botón de Instagram */}
            <a
              href={`https://instagram.com/${INSTAGRAM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:opacity-90 text-white px-4 py-2 rounded-full font-semibold transition-all shadow-md hover:scale-105 text-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </footer>

      {/* MODAL PERSONALIZACIÓN DINÁMICO */}
      {productoPersonalizando && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-rose-100">
              <h3 className="font-bold text-gray-800 text-base">
                {productoPersonalizando.soloColor ? 'Elegir Tono: ' : 'Personalizar: '} 
                {productoPersonalizando.nombre}
              </h3>
              <button onClick={() => setProductoPersonalizando(null)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <div className="mt-4 space-y-4">
              {/* CASO 1: MODELOS ESTÁNDAR (SÓLO CAMBIO DE COLOR) */}
              {productoPersonalizando.soloColor ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Color o Tono Preferido:</label>
                  <input 
                    type="text"
                    placeholder="Ej: Rosa pastel, Celeste, Colores originales..."
                    value={opcionesCustom.colorDetalle}
                    onChange={(e) => setOpcionesCustom({...opcionesCustom, colorDetalle: e.target.value})}
                    className="w-full p-2.5 bg-rose-50/50 border border-rose-200 rounded-xl text-xs focus:outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    * Este modelo tiene un diseño fijo ($9.990). Puedes indicar tu tono de hilo preferido.
                  </p>
                </div>
              ) : (
                /* CASO 2: PRODUCTO COMPLETAMENTE PERSONALIZABLE */
                <>
                  {productoPersonalizando.opcionesRelleno && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Selecciona Relleno:</label>
                      <select 
                        value={opcionesCustom.relleno}
                        onChange={(e) => setOpcionesCustom({...opcionesCustom, relleno: e.target.value})}
                        className="w-full p-2.5 bg-rose-50/50 border border-rose-200 rounded-xl text-xs font-medium focus:outline-none"
                      >
                        {productoPersonalizando.opcionesRelleno.map((r, i) => (
                          <option key={i} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Color o Tonos Preferidos:</label>
                    <input 
                      type="text"
                      placeholder="Ej: Tonos pastel, Colores originales..."
                      value={opcionesCustom.colorDetalle}
                      onChange={(e) => setOpcionesCustom({...opcionesCustom, colorDetalle: e.target.value})}
                      className="w-full p-2.5 bg-rose-50/50 border border-rose-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {productoPersonalizando.categoria === 'amigurumi' ? 'Detalles del Personaje / Ropa / Accesorios:' : 'Instrucciones Especiales:'}
                    </label>
                    <textarea 
                      rows="3"
                      placeholder={productoPersonalizando.categoria === 'amigurumi' ? "Describe aquí la ropa, peinado o personaje a elección..." : "Escribe cualquier instrucción específica..."}
                      value={opcionesCustom.notasExtra}
                      onChange={(e) => setOpcionesCustom({...opcionesCustom, notasExtra: e.target.value})}
                      className="w-full p-2.5 bg-rose-50/50 border border-rose-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => setProductoPersonalizando(null)} 
                className="w-1/2 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-xl text-xs font-bold text-gray-600 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarPersonalizacion} 
                className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-md"
              >
                Añadir al Pedido 🍒
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARRITO / SIDEBAR DE RESERVA */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-rose-100">
                <div>
                  <h3 className="font-bold text-gray-800 text-base">🛒 Mi Reserva</h3>
                  <p className="text-[11px] text-gray-400">Revisa tus productos antes de enviar</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl">🛒</span>
                  <p className="text-gray-500 font-bold text-xs mt-2">Tu pedido está vacío</p>
                  <p className="text-gray-400 text-[11px] mt-1">Navega e incorpora tus productos favoritos.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.cartId} className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 flex justify-between items-start text-xs">
                      <div className="pr-2">
                        <p className="font-bold text-gray-800">{item.nombre}</p>
                        <p className="text-rose-600 font-black mt-0.5">${Number(item.precio || 0).toLocaleString('es-CL')}</p>
                        
                        {item.detallesCustom && (
                          <div className="mt-1 text-[10px] text-gray-500 space-y-0.5 bg-white/60 p-1.5 rounded-lg border border-rose-100/50">
                            {item.detallesCustom.relleno && <p>• Relleno: {item.detallesCustom.relleno}</p>}
                            {item.detallesCustom.colorDetalle && <p>• Color/Tono: {item.detallesCustom.colorDetalle}</p>}
                            {item.detallesCustom.notasExtra && <p>• Detalle: {item.detallesCustom.notasExtra}</p>}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => eliminarDelCarrito(item.cartId)} 
                        className="text-red-400 hover:text-red-600 font-bold p-1"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-rose-100 pt-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">📅 Fecha requerida de entrega/retiro:</label>
                  <input 
                    type="date"
                    value={fechaEntrega}
                    onChange={(e) => setFechaEntrega(e.target.value)}
                    className="w-full p-2 bg-rose-50/40 border border-rose-200 rounded-xl text-xs font-medium focus:outline-none"
                  />
                </div>

                <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 space-y-1">
                  <div className="flex justify-between text-xs font-medium text-gray-600">
                    <span>Total Estimado:</span>
                    <span className="font-bold text-gray-800">${totalPrecio.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-rose-600">
                    <span>Abono para Agendar (50%):</span>
                    <span>${abonoRequerido.toLocaleString('es-CL')}</span>
                  </div>
                </div>

                <button 
                  onClick={enviarPedidoWhatsApp} 
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl text-xs shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>💬 Agendar Pedido por WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NOTIFICACIÓN TOAST */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-gray-900/90 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-2xl z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;