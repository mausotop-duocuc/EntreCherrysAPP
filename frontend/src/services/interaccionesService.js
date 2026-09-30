import { supabase } from '../supabaseClient'; // Ajusta la ruta a tu cliente de Supabase

// 1. Obtener o generar una sesión única para el navegador del usuario
export const getSessionId = () => {
  let sessionId = localStorage.getItem('cliente_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    localStorage.setItem('cliente_session_id', sessionId);
  }
  return sessionId;
};

// 2. Registrar una nueva interacción y verificar si ya acumuló 3
export const registrarYValidarInteraccion = async (tipoInteraccion, detalles = {}) => {
  const sessionId = getSessionId();

  try {
    // A) Guardar la interacción en Supabase
    const { error: insertError } = await supabase
      .from('interacciones')
      .insert([
        {
          session_id: sessionId,
          tipo_interaccion: tipoInteraccion,
          detalles: detalles
        }
      ]);

    if (insertError) {
      console.error('Error al registrar interacción:', insertError.message);
      return { exito: false, totalInteracciones: 0, esClienteValido: false };
    }

    // B) Consultar cuántas interacciones lleva este session_id en total
    const { count, error: countError } = await supabase
      .from('interacciones')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId);

    if (countError) {
      console.error('Error al contar interacciones:', countError.message);
      return { exito: false, totalInteracciones: 0, esClienteValido: false };
    }

    const total = count || 0;
    const esValido = total >= 3;

    return {
      exito: true,
      totalInteracciones: total,
      esClienteValido: esValido // True si ya completó 3 o más interacciones
    };

  } catch (error) {
    console.error('Error inesperado:', error);
    return { exito: false, totalInteracciones: 0, esClienteValido: false };
  }
};