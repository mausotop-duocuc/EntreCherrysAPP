import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// 1. TUS DATOS OFICIALES Y CONFIGURACIÓN (CONSERVA TUS RUTAS, PRECIOS E IG)
// ============================================================================

// 👉 Reemplaza con tu usuario oficial de Instagram y número de WhatsApp
export const INSTAGRAM_HANDLE = '@entrecherrys'; 
export const NUMERO_WHATSAPP = '56912345678';

// 👉 Tu catálogo de tortas con tus rutas de fotos y precios exactos
 const TORTAS_CATALOGO = [
  {
    id: 'torta-crema-clasica',
    nombre: 'Torta Crema Clásica & Cerezas',
    descripcion: 'Cobertura suave en tono menta con rosetones de crema rosa y cerezas frescas en la copa.',
    precio: 22990,
    imagen: '/torta crema clasica.jpg',
    porciones: '10 a 12 porciones',
    categoria: 'tortas',
    popular: true
  },
  {
    id: 'torta-cumpleanos-dino',
    nombre: 'Torta Cumpleaños Dinosaurios',
    descripcion: 'Torta infantil temática de 3 pisos moldeada con adorables figuras de dinosaurios.',
    precio: 45000,
    imagen: '/Torta cumpleaños.jpg',
    porciones: '25 a 30 porciones',
    categoria: 'tortas',
    popular: true
  },
  {
    id: 'torta-cumpleanos-jardin',
    nombre: 'Torta Cumpleaños Jardín Dulce',
    descripcion: 'Diseño infantil de 3 pisos en tonos pastel decorado con pajaritos, mariposas y flores.',
    precio: 45000,
    imagen: '/Torta cumpleaños 2.jpg',
    porciones: '25 a 30 porciones',
    categoria: 'tortas',
    popular: false
  },
  {
    id: 'torta-eventos-berries',
    nombre: 'Torta Eventos Chocolate & Berries',
    descripcion: 'Borde rústico de chocolate artesanal cargada con abundantes frutos rojos frescos.',
    precio: 32990,
    imagen: '/torta-eventos.jpg',
    porciones: '15 a 20 porciones',
    categoria: 'tortas',
    popular: true
  },
  {
    id: 'torta-tradicional-drip',
    nombre: 'Torta Tradicional Manjar Drip',
    descripcion: 'Clásica torta con chorreado de manjar, rosetones de crema, galletas Oreo y cerezas.',
    precio: 24990,
    imagen: '/torta-tradicional.jpg',
    porciones: '12 a 15 porciones',
    categoria: 'tortas',
    popular: false
  }
];

// 👉 Tu catálogo de amigurumis con tus rutas de fotos y precios exactos
const RUTA_BASE = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/';
 const AMIGURUMIS_CATALOGO = [
  {
    id: 'ami-capibara',
    nombre: 'Amigurumi Capibara',
    descripcion: 'Tejido a crochet con hilo suave, detalles artesanales.',
    precio: 14990,
    imagen: `${RUTA_BASE}amigurumis/Capibara.jpeg`,
    medida: '20 cm',
    categoria: 'amigurumis',
    popular: true
  },
  {
    id: 'ami-oso-pijama',
    nombre: 'Amigurumi Oso Pijama',
    descripcion: 'Tierno osito tejido con pijama intercambiable o decorativo.',
    precio: 16990,
    imagen: `${RUTA_BASE}amigurumis/oso-pijama.jpeg`,
    medida: '25 cm',
    categoria: 'amigurumis',
    popular: true
  },
  {
    id: 'ami-personalizado',
    nombre: 'Amigurumi Personalizado',
    descripcion: 'Muñeco tejido a mano según tus especificaciones de diseño.',
    precio: 18990,
    imagen: `${RUTA_BASE}amigurumis/personalizado.jpeg`,
    medida: '22 cm',
    categoria: 'amigurumis',
    popular: false
  },
  {
    id: 'ami-ratita',
    nombre: 'Amigurumi Ratita',
    descripcion: 'Llavero o figura pequeña tejida con gran precisión.',
    precio: 8990,
    imagen: `${RUTA_BASE}amigurumis/ratita.jpeg`,
    medida: '12 cm',
    categoria: 'amigurumis',
    popular: false
  },
  {
    id: 'ami-vaquita',
    nombre: 'Amigurumi Vaquita',
    descripcion: 'Adorable vaquita tejida en hilo hipoalergénico.',
    precio: 15990,
    imagen: `${RUTA_BASE}amigurumis/vaquita.jpeg`,
    medida: '22 cm',
    categoria: 'amigurumis',
    popular: true
  },
  {
    id: 'ami-zorro',
    nombre: 'Amigurumi Zorro',
    descripcion: 'Simpático zorrito en tonos naranja y blanco.',
    precio: 14990,
    imagen: `${RUTA_BASE}amigurumis/zorro.jpeg`,
    medida: '18 cm',
    categoria: 'amigurumis',
    popular: false
  }
];

// Configuración de fondo del banner e imágenes de reserva
const IMAGEN_BANNER_FONDO = 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1600&q=80';
const IMAGEN_FALLBACK_TORTA = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80';
const IMAGEN_FALLBACK_AMIGURUMI = 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=800&q=80';

// ============================================================================
// 2. CONFIGURACIÓN SUPABASE
// ============================================================================
const obtenerVariableEntorno = (keyVite, keyCRA, fallback) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[keyVite]) {
      return import.meta.env[keyVite];
    }
  } catch (e) {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[keyCRA]) {
      return process.env[keyCRA];
    }
  } catch (e) {}
  return fallback;
};

const supabaseUrl = obtenerVariableEntorno(
  'VITE_SUPABASE_URL',
  'REACT_APP_SUPABASE_URL',
  'https://tu-proyecto.supabase.co'
);

const supabaseAnonKey = obtenerVariableEntorno(
  'VITE_SUPABASE_ANON_KEY',
  'REACT_APP_SUPABASE_ANON_KEY',
  'tu-anon-key'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// 3. OPCIONES DE PERSONALIZACIÓN DE TORTAS
// ============================================================================
export const OPCIONES_TAMAÑO = [
  { id: '10 personas', nombre: '10 Porciones', precio: 18000 },
  { id: '15 personas', nombre: '15 Porciones', precio: 25000 },
  { id: '20 personas', nombre: '20 Porciones', precio: 32000 },
  { id: '30 personas', nombre: '30 Porciones', precio: 45000 },
  { id: '50 personas', nombre: '50 Porciones (2 Pisos)', precio: 72000 }
];

export const OPCIONES_BIZCOCHO = [
  'Vainilla Tradicional',
  'Chocolate Intenso',
  'Red Velvet',
  'Zanahoria & Nueces',
  'Amapola & Limón',
  'Bizcocho Mixto'
];

export const OPCIONES_RELLENO = [
  'Manjar con Lúcuta',
  'Manjar & Nueces',
  'Crema Pastelera & Frambuesas',
  'Ganache de Chocolate & Frutillas',
  'Crema Chantilly & Durazno',
  'Nutella & Plátano'
];

export const OPCIONES_COBERTURA = [
  'Buttercream de Vainilla Suave',
  'Merengue Italiano',
  'Naked Cake (Semi desnuda)',
  'Ganache de Chocolate',
  'Fondant Estilizado'
];

export const OPCIONES_EXTRAS = [
  { id: 'flores', nombre: 'Flores Naturales de Estación', precio: 3500 },
  { id: 'macarons', nombre: 'Topping de Macarons (4 unid)', precio: 4000 },
  { id: 'topper', nombre: 'Topper Personalizado de Cumpleaños', precio: 2500 },
  { id: 'velas', nombre: 'Vela Numérica Especial', precio: 1200 }
];

// ============================================================================
// 4. FUNCIONES AUXILIARES
// ============================================================================
export const formatearCLP = (monto) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(monto || 0);
};

export const generarCartId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

// ============================================================================
// 5. BANNER HERO CON IMAGEN DE FONDO
// ============================================================================


// ============================================================================
// 6. SECCIÓN AMIGURUMIS
// ============================================================================
export function SeccionAmigurumis({ onAgregarAlCarrito }) {
  return (
    <div className="space-y-8">
      <div className="border-b border-rose-100 pb-6">
        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">
          Muñecos Tejidos a Crochet 🧶
        </span>
        <h3 className="text-3xl font-serif font-bold text-rose-950 italic">
          Colección de Amigurumis
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Diseños elaborados hilo a hilo con materiales hipoalergénicos, perfectos para regalar o acompañar tu torta.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {AMIGURUMIS_CATALOGO.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-3xl border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-64 bg-rose-50 overflow-hidden">
                <img 
                  src={item.imagen} 
                  alt={item.nombre} 
                  onError={(e) => { e.target.onerror = null; e.target.src = IMAGEN_FALLBACK_AMIGURUMI; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.popular && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    ⭐ Más Pedido
                  </span>
                )}
                {item.medida && (
                  <span className="absolute bottom-3 right-3 bg-white/90 text-stone-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    📏 {item.medida}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h4 className="font-serif font-bold text-stone-800 text-base group-hover:text-rose-600 transition">
                  {item.nombre}
                </h4>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {item.descripcion}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-rose-50 mt-2">
              <span className="font-serif font-bold text-rose-700 text-xl">
                {formatearCLP(item.precio)}
              </span>
              <button
                onClick={() => onAgregarAlCarrito({
                  ...item,
                  cartId: generarCartId(),
                  cantidad: 1
                })}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>🛒</span>
                <span>Añadir</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 7. SECCIÓN CONTACTO (WHATSAPP & INSTAGRAM OFICIAL)
// ============================================================================
// ============================================================================
// 6. SECCIÓN REDES SOCIALES (ESTILO COZY & ARTESANAL ☕🧶)
// ============================================================================
export function SeccionRedesSociales() {
  const instagramUrl = `https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`;

  return (
    <section className="relative bg-gradient-to-br from-amber-50/80 via-rose-50/70 to-orange-50/50 rounded-[2.5rem] p-8 md:p-12 border-2 border-dashed border-rose-200/80 shadow-sm overflow-hidden">
      {/* Luces de fondo suaves para ambiente acogedor */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-800 bg-white/80 px-4 py-1.5 rounded-full border border-rose-200/60 shadow-sm backdrop-blur-sm">
          <span>☕</span> Un rinconcito dulce & artesanal
        </span>
        <h3 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 italic">
          Síguenos e Inicia tu Pedido
        </h3>
        <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-light">
          Cada torta horneada y cada amigurumi tejido lleva un pedacito de nuestro corazón. Escríbenos para acompañar tus momentos especiales. 🧶🍰
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Tarjeta WhatsApp */}
        <div className="bg-white/80 backdrop-blur-sm p-7 rounded-3xl border border-amber-100/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                💬
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Atención Cercana
                </span>
                <h4 className="font-serif font-bold text-stone-800 text-lg mt-0.5">Conversa con nosotros</h4>
              </div>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed pt-1">
              ¿Tienes una idea en mente, quieres elegir tus sabores o consultar disponibilidad? Tómate un café y escríbenos con toda confianza.
            </p>
          </div>

          <a 
            href={`https://wa.me/${NUMERO_WHATSAPP}?text=¡Hola!%20Quisiera%20hacer%20una%20consulta%20sobre%20las%20tortas%20y%20amigurumis.`}
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl text-center shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💌</span> Hablar por WhatsApp
          </a>
        </div>

        {/* Tarjeta Instagram */}
        <div className="bg-white/80 backdrop-blur-sm p-7 rounded-3xl border border-rose-100/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                📸
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                  {INSTAGRAM_HANDLE}
                </span>
                <h4 className="font-serif font-bold text-stone-800 text-lg mt-0.5">Comunidad & Proceso</h4>
              </div>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed pt-1">
              Mira cómo cobran vida los muñequitos hilo a hilo y conoce el detrás de escena de la decoración de nuestras tortas.
            </p>
          </div>

          <a 
            href={instagramUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 w-full py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs rounded-2xl text-center shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>✨</span> Visitar Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 8. SECCIÓN TORTAS (CATÁLOGO + CREADOR A LA MEDIDA)
// ============================================================================
export function SeccionTortas({ onAgregarAlCarrito }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroSoloPopulares, setFiltroSoloPopulares] = useState(false);

  // Estados Creador
  const [tamaño, setTamaño] = useState('10 personas');
  const [bizcocho, setBizcocho] = useState('Vainilla Tradicional');
  const [relleno1, setRelleno1] = useState('Manjar con Lúcuta');
  const [relleno2, setRelleno2] = useState('Sin segundo relleno');
  const [cobertura, setCobertura] = useState('Buttercream de Vainilla Suave');
  const [mensaje, setMensaje] = useState('');
  const [extrasSeleccionados, setExtrasSeleccionados] = useState([]);
  const [mensajeAgregado, setMensajeAgregado] = useState(false);

  const tortasFiltradas = useMemo(() => {
    return TORTAS_CATALOGO.filter((torta) => {
      const coincide = torta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                       torta.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const coincidePopular = filtroSoloPopulares ? torta.popular : true;
      return coincide && coincidePopular;
    });
  }, [busqueda, filtroSoloPopulares]);

  const precioCalculado = useMemo(() => {
    const objT = OPCIONES_TAMAÑO.find((t) => t.id === tamaño);
    const base = objT ? objT.precio : 18000;
    const extraRelleno = relleno2 !== 'Sin segundo relleno' ? 2500 : 0;
    const extrasCosto = extrasSeleccionados.reduce((acc, id) => {
      const ex = OPCIONES_EXTRAS.find((e) => e.id === id);
      return acc + (ex ? ex.precio : 0);
    }, 0);
    return base + extraRelleno + extrasCosto;
  }, [tamaño, relleno2, extrasSeleccionados]);

  const toggleExtra = (id) => {
    setExtrasSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAgregarPersonalizada = (e) => {
    e.preventDefault();
    const nombresExtras = extrasSeleccionados.map((id) => OPCIONES_EXTRAS.find((e) => e.id === id)?.nombre);

    onAgregarAlCarrito({
      id: `torta-custom-${generarCartId()}`,
      cartId: generarCartId(),
      nombre: `Torta Personalizada (${tamaño})`,
      precio: precioCalculado,
      cantidad: 1,
      categoria: 'tortas',
      imagen: TORTAS_CATALOGO[0]?.imagen || '/torta crema clasica.jpg',
      detallesCustom: {
        tamaño,
        bizcocho,
        rellenoPrincipal: relleno1,
        rellenoSecundario: relleno2,
        cobertura,
        mensajeTorta: mensaje,
        extras: nombresExtras
      }
    });

    setMensaje('');
    setExtrasSeleccionados([]);
    setMensajeAgregado(true);
    setTimeout(() => setMensajeAgregado(false), 3000);
  };

  return (
    <div className="space-y-16">
      {/* CATÁLOGO DE TORTAS */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-rose-100 pb-6">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">
              Catálogo de Especialidades 🎂
            </span>
            <h3 className="text-3xl font-serif font-bold text-rose-950 italic">
              Tortas Prediseñadas
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input 
              type="text"
              placeholder="Buscar sabor o estilo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-4 py-2 bg-white border border-rose-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-300 w-full sm:w-64"
            />
            <button
              onClick={() => setFiltroSoloPopulares(!filtroSoloPopulares)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                filtroSoloPopulares ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-rose-700 border-rose-200'
              }`}
            >
              {filtroSoloPopulares ? '⭐ Mostrando Populares' : '⭐ Populares'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tortasFiltradas.map((torta) => (
            <div 
              key={torta.id}
              className="bg-white rounded-3xl border border-rose-100 shadow-sm hover:shadow-xl transition duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-60 bg-rose-50 overflow-hidden">
                  <img 
                    src={torta.imagen} 
                    alt={torta.nombre} 
                    onError={(e) => { e.target.onerror = null; e.target.src = IMAGEN_FALLBACK_TORTA; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {torta.popular && (
                    <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                      ⭐ Favorita
                    </span>
                  )}
                  {torta.porciones && (
                    <span className="absolute bottom-3 right-3 bg-white/95 text-stone-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                      {torta.porciones}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h4 className="font-serif font-bold text-stone-800 text-lg group-hover:text-rose-600 transition">
                    {torta.nombre}
                  </h4>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">{torta.descripcion}</p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-rose-50 mt-4">
                <span className="font-serif font-bold text-rose-700 text-2xl">{formatearCLP(torta.precio)}</span>
                <button
                  onClick={() => onAgregarAlCarrito({ ...torta, cartId: generarCartId(), cantidad: 1 })}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition shadow-md cursor-pointer"
                >
                  🛒 Añadir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREADOR PERSONALIZADO */}
      <section className="bg-gradient-to-br from-rose-50 via-amber-50/30 to-pink-50 p-6 md:p-10 rounded-3xl border border-rose-100 shadow-lg">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Creador a la Medida ✨</span>
          <h3 className="text-3xl font-serif font-bold text-rose-950 italic">Arma tu Torta Paso a Paso</h3>
        </div>

        <form onSubmit={handleAgregarPersonalizada} className="bg-white p-6 md:p-8 rounded-2xl border border-rose-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-2">1. Porciones 🍰</label>
              <select value={tamaño} onChange={(e) => setTamaño(e.target.value)} className="w-full p-3 border border-rose-200 rounded-xl">
                {OPCIONES_TAMAÑO.map((item) => (
                  <option key={item.id} value={item.id}>{item.nombre} - {formatearCLP(item.precio)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-2">2. Bizcocho 🧁</label>
              <select value={bizcocho} onChange={(e) => setBizcocho(e.target.value)} className="w-full p-3 border border-rose-200 rounded-xl">
                {OPCIONES_BIZCOCHO.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-2">3. Relleno Principal 🍯</label>
              <select value={relleno1} onChange={(e) => setRelleno1(e.target.value)} className="w-full p-3 border border-rose-200 rounded-xl">
                {OPCIONES_RELLENO.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-2">4. Cobertura 🎨</label>
              <select value={cobertura} onChange={(e) => setCobertura(e.target.value)} className="w-full p-3 border border-rose-200 rounded-xl">
                {OPCIONES_COBERTURA.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-stone-700 mb-2">Mensaje Escrito en la Torta ✍️</label>
            <input 
              type="text" 
              placeholder='Ej: "¡Feliz Cumpleaños Camila!"'
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="w-full p-3 border border-rose-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-3">Extras Opcionales ✨</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {OPCIONES_EXTRAS.map((extra) => {
                const sel = extrasSeleccionados.includes(extra.id);
                return (
                  <div 
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition select-none ${
                      sel ? 'bg-rose-500 text-white border-rose-500' : 'bg-stone-50 border-rose-200 text-stone-700'
                    }`}
                  >
                    <span>{extra.nombre}</span>
                    <span className="font-bold ml-1">+{formatearCLP(extra.precio)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {mensajeAgregado && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs text-center font-bold rounded-xl border border-emerald-200">
              🎉 ¡Torta personalizada agregada al pedido!
            </div>
          )}

          <div className="pt-4 border-t border-rose-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Total Torta</span>
              <span className="text-2xl font-serif font-bold text-rose-700">{formatearCLP(precioCalculado)}</span>
            </div>

            <button 
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              🍒 Añadir Torta al Pedido
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

// ============================================================================
// 9. MODAL CHECKOUT
// ============================================================================
export function ModalCheckout({ carrito, total, onClose, onPedidoExitoso }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState('retiro');
  const [direccion, setDireccion] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !telefono || !fechaEntrega) return;

    setCargando(true);

    try {
      if (supabase && typeof supabase.from === 'function') {
        await supabase.from('pedidos').insert([{
          cliente_nombre: nombre,
          cliente_telefono: telefono,
          fecha_entrega: fechaEntrega,
          metodo_entrega: metodoEntrega,
          direccion_despacho: direccion,
          monto_total: total,
          items: carrito,
          created_at: new Date().toISOString()
        }]);
      }
    } catch (e) {
      console.warn('Nota Supabase:', e);
    } finally {
      let texto = `*¡Hola! Quiero confirmar mi pedido:*%0A%0A`;
      texto += `👤 *Nombre:* ${encodeURIComponent(nombre)}%0A`;
      texto += `📞 *Teléfono:* ${encodeURIComponent(telefono)}%0A`;
      texto += `📅 *Fecha:* ${encodeURIComponent(fechaEntrega)}%0A`;
      texto += `🚚 *Entrega:* ${metodoEntrega === 'despacho' ? `Despacho: ${encodeURIComponent(direccion)}` : 'Retiro en Local'}%0A%0A`;
      texto += `🛒 *PRODUCTOS:*%0A`;

      carrito.forEach((item, i) => {
        texto += `*${i + 1}. ${encodeURIComponent(item.nombre)}* x${item.cantidad || 1} - ${encodeURIComponent(formatearCLP(item.precio))}%0A`;
      });

      texto += `%0A💰 *TOTAL:* ${encodeURIComponent(formatearCLP(total))}`;

      window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${texto}`, '_blank');
      if (onPedidoExitoso) onPedidoExitoso();
      setCargando(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 font-bold p-2 cursor-pointer">✕</button>

        <h3 className="text-2xl font-serif font-bold text-rose-950 mb-1">Finalizar Pedido 🛍</h3>
        <p className="text-xs text-stone-500 mb-6">Coordinaremos la entrega vía WhatsApp.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Nombre Completo *</label>
            <input 
              type="text" 
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: María José"
              className="w-full px-4 py-2.5 border border-rose-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Teléfono WhatsApp *</label>
              <input 
                type="tel" 
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full px-4 py-2.5 border border-rose-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Fecha Entrega *</label>
              <input 
                type="date" 
                required
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className="w-full px-4 py-2.5 border border-rose-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Tipo de Entrega</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMetodoEntrega('retiro')}
                className={`py-2 rounded-xl border text-xs font-bold ${
                  metodoEntrega === 'retiro' ? 'bg-rose-500 text-white border-rose-500' : 'bg-stone-50 border-rose-200'
                }`}
              >
                🏪 Retiro en Local
              </button>
              <button
                type="button"
                onClick={() => setMetodoEntrega('despacho')}
                className={`py-2 rounded-xl border text-xs font-bold ${
                  metodoEntrega === 'despacho' ? 'bg-rose-500 text-white border-rose-500' : 'bg-stone-50 border-rose-200'
                }`}
              >
                🛵 Despacho
              </button>
            </div>
          </div>

          {metodoEntrega === 'despacho' && (
            <div>
              <label className="block font-bold text-stone-700 mb-1">Dirección de Despacho</label>
              <input 
                type="text" 
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección completa..."
                className="w-full px-4 py-2.5 border border-rose-200 rounded-xl"
              />
            </div>
          )}

          <div className="pt-4 border-t border-rose-100 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Total</span>
              <span className="text-xl font-serif font-bold text-rose-700">{formatearCLP(total)}</span>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition cursor-pointer"
            >
              📲 Enviar a WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 10. DRAWER DEL CARRITO
// ============================================================================
export function CarritoDrawer({ abierto, onClose, carrito, onEliminarItem, onModificarCantidad, onAbrirCheckout }) {
  if (!abierto) return null;
  const total = carrito.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          <div className="p-6 border-b border-rose-100 flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-rose-950">🛒 Tu Carrito ({carrito.length})</h3>
            <button onClick={onClose} className="text-stone-400 font-bold p-2 cursor-pointer">✕</button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {carrito.length === 0 ? (
              <p className="text-center text-xs text-stone-400 py-12">El carrito está vacío.</p>
            ) : (
              carrito.map((item) => (
                <div key={item.cartId} className="p-4 bg-stone-50 rounded-2xl border border-rose-100 flex gap-3 relative">
                  <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    onError={(e) => { e.target.onerror = null; e.target.src = IMAGEN_FALLBACK_TORTA; }}
                    className="w-16 h-16 object-cover rounded-xl bg-rose-100" 
                  />
                  <div className="flex-1 text-xs">
                    <h5 className="font-bold text-stone-800">{item.nombre}</h5>
                    <p className="text-rose-700 font-bold mt-1">{formatearCLP(item.precio)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => onModificarCantidad(item.cartId, -1)} className="w-5 h-5 bg-stone-200 rounded font-bold cursor-pointer">-</button>
                      <span className="font-bold">{item.cantidad || 1}</span>
                      <button onClick={() => onModificarCantidad(item.cartId, 1)} className="w-5 h-5 bg-stone-200 rounded font-bold cursor-pointer">+</button>
                    </div>
                  </div>
                  <button onClick={() => onEliminarItem(item.cartId)} className="text-stone-400 hover:text-rose-600 font-bold text-xs cursor-pointer">🗑️</button>
                </div>
              ))
            )}
          </div>

          {carrito.length > 0 && (
            <div className="p-6 border-t border-rose-100 bg-rose-50/50 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-stone-800">
                <span>Total Estimado:</span>
                <span className="text-xl font-serif text-rose-700">{formatearCLP(total)}</span>
              </div>
              <button
                onClick={() => { onClose(); onAbrirCheckout(); }}
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase rounded-xl shadow transition cursor-pointer"
              >
                Procesar Pedido ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ============================================================================
// HEADER / BARRA DE NAVEGACIÓN (ESTILO COZY & ARTESANAL ☕🍰🧶)
// ============================================================================
export function Header({ totalCarrito = 0, onAbrirCarrito }) {
  const numeroWhatsapp = typeof NUMERO_WHATSAPP !== 'undefined' ? NUMERO_WHATSAPP : '56912345678';

  return (
    <header className="sticky top-0 z-50 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-rose-100/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Marca */}
        <div className="flex items-center gap-3.5 group cursor-pointer">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-100 via-amber-100 to-orange-100 border border-rose-200/70 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
            🍰
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg md:text-xl text-stone-800 tracking-tight">
                Pastelería & Tejidos
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100/70 px-2.5 py-0.5 rounded-full border border-rose-200/50">
                <span>🧶</span> Hecho con amor
              </span>
            </div>
            <span className="text-[10px] md:text-[11px] font-medium tracking-widest uppercase text-amber-800/80 -mt-0.5">
              Diseño Artesanal & Dulce
            </span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Botón WhatsApp */}
          <a
            href={`https://wa.me/${numeroWhatsapp}?text=¡Hola!%20Me%20gustaría%20hacer%20un%20pedido.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50/90 hover:bg-emerald-100/80 text-emerald-800 text-xs font-bold border border-emerald-200/80 shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <span className="text-sm">💬</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Botón Carrito */}
          <button
            onClick={onAbrirCarrito}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-50 to-amber-50 hover:from-rose-100 hover:to-amber-100 text-stone-800 text-xs font-bold border border-rose-200/80 shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <span className="text-base">🛒</span>
            <span className="hidden sm:inline font-serif italic text-stone-700">Carrito</span>
            
            <span className="flex items-center justify-center min-w-[22px] h-5 px-1.5 text-[11px] font-black text-white bg-rose-500 rounded-full shadow-sm ml-0.5">
              {totalCarrito}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
// ============================================================================
// BANNER HERO CON FOTO PERSONALIZADA (ESTILO COZY & ARTESANAL ☕🍰🧶)
// ============================================================================
// ============================================================================
// BANNER HERO CON ROTACIÓN AUTOMÁTICA DE FOTOS (ESTILO POLAROID)
// ============================================================================
export function BannerHero() {
  // 📸 Agrega o quita aquí todas las rutas de fotos de tu catálogo
  const fotosPortada = [
    '/amigurumis/Capibara.jpeg',
    '/tortas/torta-tradicional.jpg',
    '/amigurumis/oso-pijama.jpeg',
    '/tortas/torta-eventos.jpg',
    '/amigurumis/zorro.jpeg',
    '/tortas/torta crema clasica.jpg',
    '/amigurumis/vaquita.jpeg',
    '/tortas/Torta cumpleaños.jpg',
    '/amigurumis/ratita.jpeg',
    '/tortas/Torta cumpleaños 2.jpg',
    '/amigurumis/personalizado.jpeg',
  ];

  const [indiceFoto, setIndiceFoto] = useState(0);

  // Cambia la foto automáticamente cada 3.5 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceFoto((prev) => (prev + 1) % fotosPortada.length);
    }, 3500);

    return () => clearInterval(intervalo);
  }, [fotosPortada.length]);

  const numeroWhatsapp = typeof NUMERO_WHATSAPP !== 'undefined' ? NUMERO_WHATSAPP : '56912345678';

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-50/80 via-rose-50/60 to-orange-50/40 border border-rose-100/80 p-6 md:p-12 shadow-sm my-6">
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Textos y Botones */}
        <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-rose-800 bg-white/90 px-4 py-1.5 rounded-full border border-rose-200/70 shadow-sm backdrop-blur-sm">
            <span>✨</span> Hecho a mano & con mucho amor
          </span>
          
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 leading-tight">
            Pastelería dulce & <span className="text-rose-600 italic">amigurumis tejidos</span>
          </h1>
          
          <p className="text-sm md:text-base text-stone-600 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
            Creamos momentos únicos para tus fechas especiales. Cada torta y cada figura tejida está hecha de manera 100% artesanal.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <a
              href="#catalogo"
              className="px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <span>🍰</span> Explorar Catálogo
            </a>
            <a
              href={`https://wa.me/${numeroWhatsapp}?text=¡Hola!%20Quisiera%20pedir%20una%20cotización%20personalizada.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-rose-50 text-stone-800 font-bold text-xs border border-rose-200 shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>💌</span> Cotización Especial
            </a>
          </div>
        </div>

        {/* Marco Polaroid con animación de fotos */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group w-full max-w-sm">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-200 via-amber-200 to-orange-200 rounded-[2.2rem] blur-md opacity-60 group-hover:opacity-90 transition duration-300" />
            
            <div className="relative bg-white p-4 rounded-[2rem] border border-rose-100 shadow-md transform md:rotate-2 group-hover:rotate-0 transition-transform duration-300">
              <div className="overflow-hidden rounded-2xl aspect-square bg-rose-50 relative">
                <img
                  key={indiceFoto}
                  src={fotosPortada[indiceFoto]}
                  alt="Entre Cherrys Portada"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-in-out"
                />
              </div>
              <div className="pt-3 pb-1 text-center">
                <p className="font-serif italic text-xs text-stone-600 font-medium">
                  Entre Cherrys • Pastelería & Crochet 🍒
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
// ============================================================================
// 11. COMPONENTE PRINCIPAL (APP)
// ============================================================================

export default function App() {
  const [pestanaActiva, setPestanaActiva] = useState('todas');
  const [carrito, setCarrito] = useState([]);
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState('');

  const totalCalculado = carrito.reduce(
    (acc, item) => acc + (item.precio * (item.cantidad || 1)),
    0
  );

  const handleAgregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === producto.id);
      if (existe) {
        return prev.map((i) =>
          i.id === producto.id ? { ...i, cantidad: (i.cantidad || 1) + 1 } : i
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setNotificacion(`¡${producto.nombre} agregado al carrito!`);
    setTimeout(() => setNotificacion(''), 3000);
  };

  const handleEliminarItem = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const handleModificarCantidad = (id, cambio) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nuevaCantidad = (item.cantidad || 1) + cambio;
            return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 antialiased selection:bg-rose-200">
      
      {/* NOTIFICACIÓN FLOTANTE */}
      {notificacion && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl">
          ✨ {notificacion}
        </div>
      )}

      {/* 1. HEADER COZY */}
     {/* HEADER EXISTENTE */}
      <Header 
        totalCarrito={carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0)} 
        onAbrirCarrito={() => setDrawerAbierto(true)} 
      />

      {/* AGREGA SOLO ESTE BLOQUE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BannerHero />
      </div>

      {/* AQUÍ SIGUE TODO TU CÓDIGO ORIGINAL (PESTAÑAS, CATÁLOGO, CARRITO, ETC.) */}
      /

      {/* NAVEGACIÓN POR PESTAÑAS */}
      <div id="catalogo" className="max-w-7xl mx-auto px-4 pt-10">
        <div className="flex justify-center border-b border-rose-100 pb-4 gap-2 sm:gap-4 text-xs font-bold">
          <button
            onClick={() => setPestanaActiva('todas')}
            className={`px-5 py-2.5 rounded-xl transition cursor-pointer ${
              pestanaActiva === 'todas'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-rose-50 border border-rose-100'
            }`}
          >
            ✨ Ver Todo
          </button>
          <button
            onClick={() => setPestanaActiva('tortas')}
            className={`px-5 py-2.5 rounded-xl transition cursor-pointer ${
              pestanaActiva === 'tortas'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-rose-50 border border-rose-100'
            }`}
          >
            🍰 Tortas & Pasteles
          </button>
          <button
            onClick={() => setPestanaActiva('amigurumis')}
            className={`px-5 py-2.5 rounded-xl transition cursor-pointer ${
              pestanaActiva === 'amigurumis'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-rose-50 border border-rose-100'
            }`}
          >
            🧶 Amigurumis Tejidos
          </button>
        </div>
      </div>

      {/* CONTENIDO DE SECCIONES */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
        {(pestanaActiva === 'todas' || pestanaActiva === 'tortas') && (
          <SeccionTortas onAgregarAlCarrito={handleAgregarAlCarrito} />
        )}

        {(pestanaActiva === 'todas' || pestanaActiva === 'amigurumis') && (
          <SeccionAmigurumis onAgregarAlCarrito={handleAgregarAlCarrito} />
        )}

        <SeccionRedesSociales />
      </main>

      {/* DRAWER CARRITO */}
      <CarritoDrawer
        abierto={drawerAbierto}
        onClose={() => setDrawerAbierto(false)}
        carrito={carrito}
        onEliminarItem={handleEliminarItem}
        onModificarCantidad={handleModificarCantidad}
        onAbrirCheckout={() => setCheckoutAbierto(true)}
      />

      {/* CHECKOUT MODAL */}
      {checkoutAbierto && (
        <ModalCheckout
          carrito={carrito}
          total={totalCalculado}
          onClose={() => setCheckoutAbierto(false)}
          onPedidoExitoso={() => setCarrito([])}
        />
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-rose-100 py-10 text-center text-xs text-stone-400 space-y-2 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-serif text-sm font-bold text-rose-950">Pastelería & Tejidos Artesanales</p>
          <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}