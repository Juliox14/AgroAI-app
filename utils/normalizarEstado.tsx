export const Estado_completo: Record<string,string> = {
    'Ags.':    'Aguascalientes',
    'B.C.':    'Baja California',
    'B.C.S.':  'Baja California Sur',
    'Camp.':   'Campeche',
    'Chis.':   'Chiapas',
    'Chih.':   'Chihuahua',
    'CDMX':    'Ciudad de México',
    'Coah.':   'Coahuila',
    'Col.':    'Colima',
    'Dgo.':    'Durango',
    'Edomex':  'Estado de México',
    'Gto.':    'Guanajuato',
    'Gro.':    'Guerrero',
    'Hgo.':    'Hidalgo',
    'Jal.':    'Jalisco',
    'Mich.':   'Michoacán',
    'Mor.':    'Morelos',
    'Nay.':    'Nayarit',
    'N.L.':    'Nuevo León',
    'Oax.':    'Oaxaca',
    'Pue.':    'Puebla',
    'Qro.':    'Querétaro',
    'Q. Roo.': 'Quintana Roo',
    'S.L.P.':  'San Luis Potosí',
    'Sin.':    'Sinaloa',
    'Son.':    'Sonora',
    'Tab.':    'Tabasco',
    'Tamps.':  'Tamaulipas',
    'Tlax.':   'Tlaxcala',
    'Ver.':    'Veracruz',
    'Yuc.':    'Yucatán',
    'Zac.':    'Zacatecas'
  };
  
  /**
   * Normaliza el nombre de estado (abreviatura → nombre completo)
   * @param abreviatura Abreviatura del estado
   */
  export function normalizarEstado(abreviatura: string): string {
    const key = abreviatura.trim();
    return Estado_completo[key] ?? key;
  }
  