
// LOLA BEAUTY - SIMULADOR DE TIENDA DE MAQUILLAJE
// Pre-Entrega 3: Funciones e Integración de Lógica
//
// Interacción: prompt (entrada), alert y console (salida)
//
// ARQUITECTURA (algoritmo básico de todo programa):
//   FASE 1 · ENTRADA        -> pedirTexto, pedirEntero, confirmarSiNo
//   FASE 2 · PROCESAMIENTO  -> calcularImporte, calcularPorcentaje,
//                              calcularSubtotal, calcularTotales,
//                              obtenerPorcentajeVolumen, validarCupon,
//                              agregarAlCarrito, elegirMetodoPago
//   FASE 3 · SALIDA         -> mostrarCarrito, mostrarFactura
//
// TIPOS DE FUNCIÓN USADOS:
//   Declaradas (function)  -> la mayoría de las funciones
//   Expresada              -> obtenerPorcentajeVolumen
//   Flecha (=>)            -> formatoPesos, calcularImporte, calcularPorcentaje,
//                             cantidadEnCarrito, totalUnidades
//
// RETURN: las funciones de entrada, cálculo y construcción de
// texto retornan valores que se reutilizan en el algoritmo.

//constantes y datos

const IVA = 19;      //porcentaje de IVA
const ENVIO_BASE = 12000;    //costo de envio
const ENVIO_GRATIS_DESDE = 150000; // monto para envio gratis

const CUPONES = {
    LOLA100: 10,
    BELLEZA5: 5,
    PRIMERA15: 15,
};

const catalogo = [
    {id: 1, nombre: "Labial mate", categoria: "Labios", precio: 32000, stock: 10},
     {id: 2, nombre: "Brillo labial", categoria: "Labios", precio: 24000, stock: 8},
      {id: 3, nombre: "Base liquida", categoria: "Rostro", precio: 55000, stock: 6},
       {id: 4, nombre: "Corrector", categoria: "Rostro", precio: 38000, stock: 7},
        {id: 5, nombre: "Rubor en polvo", categoria: "Rostro", precio: 35000, stock: 5},
         {id: 6, nombre: "Iluminador", categoria: "Rostro", precio: 48000, stock: 4},
          {id: 7, nombre: "Mascara de pestañas", categoria: "Labios", precio: 42000, stock: 9},
           {id: 8, nombre: "Paleta de sombras", categoria: "Labios", precio: 78000, stock: 3},
            {id: 9, nombre: "Delineador", categoria: "Labios", precio: 28000, stock: 12},
             {id: 10, nombre: "Set de brochas", categoria: "Labios", precio: 65000, stock: 4},

];

// FASE 2 · PROCESAMIENTO - Funciones flecha (ES6)
// Optimizan procesos simples y retornan un valor

// @param {number} valor  -> @returns {string} texto en pesos colombianos
const formatoPesos = (valor) => "$" + Math.round(valor).toLocaleString("es-CO");

// @param {number} precio, {number} cantidad -> @returns {number} importe de la línea
const calcularImporte = (precio, cantidad) => precio * cantidad;

// @param {number} monto, {number} porcentaje -> @returns {number} valor del porcentaje
const calcularPorcentaje  = (monto , porcentaje) => monto * (porcentaje / 100);

// @param {Array} carrito, {number} idProducto -> @returns {number} unidades en el carrito
const cantidadEnCarrito = (carrito, idProducto) => {
    const item = carrito.find((elemento) => elemento.id === idProducto);
    return item ? item.cantidad : 0;
};

// @param {Array} carrito -> @returns {number} total de unidades
const totalUnidades = (carrito) => 
    carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);


// FASE 2 · PROCESAMIENTO - Función expresada (condicionales)

// @param {number} subtotal -> @returns {number} % de descuento por volumen
const obtenerPorcentajeVolumen = function (subtotal) {
    if (subtotal >= 300000 ) {
        return 15;
    } else if (subtotal >= 200000) {
        return 10;
         } else if (subtotal >= 100000) {
            return 5;
    } else {
        return 0;
    }
};

// FASE 1 · ENTRADA DE DATOS (prompt + validación con ciclos)
  
  //Pide un texto no vacio. Retorna null si se cancela.
  function pedirTexto(mensaje) {
    while (true) {
        const entrada = prompt(mensaje);
    
        if (entrada === null) {
            return null;
        }
        if (entrada.trim() !== "") {
            return entrada.trim();
        }
        alert("Este campo no puede estar vacio.");
    }
}

//Pide un numero entero dentro de un rango. Retorna null si se cancela.
function pedirEntero(mensaje, minimo, maximo) {
    while (true) {
        const entrada = prompt(mensaje);

        if(entrada === null) {
            return null;
        }

        const numero = Number(entrada.trim());

        if (entrada.trim() !== "" && Number.isInteger(numero) && numero >= minimo && numero <= maximo) {
            return numero;
        }
        alert("Entrada invalida. Ingresa un numero entero entre" + minimo + " y " + maximo + ".");
    }

}

//Pregunta si/no. Retorna true o false.
function confirmarSiNo(mensaje) {
    while (true) {
        const entrada = prompt(mensaje + "(si / no)");

        if (entrada === null) {
            return false;
        }

        const respuesta = entrada.trim().toLowerCase();

        if  (respuesta === "si" || respuesta === "si") {
            return true;
        }
        if (respuesta === "no") {
            return false;
        }
        alert('Responde unicamente "si" o "no". ');
    }
}
// APOYO - Construcción de mensajes (retornan strings)

function construirMenuPrincipal(nombre, carrito, cupon) {
    const estadoCupon = cupon ? cupon.codigo + " (" + cupon.porcentaje + "%)" : "ninguno";

    return(
        "💄 LOLA Beauty . Hola, " + nombre + "\n" +
        "Carrito: " + totalUnidades(carrito) + " unidad(es) | Cupon: " + estadoCupon + "\n\n" +
        "1. Agregar productos\n" +
        "2. Ver carrito\n" +
        "3. Quitar un producto\n" +
        "4. Aplicar cupon\n" +
        "5. Finalizar compra\n\n" +
        "Escribe el numero de la opcion (Cancelar para salir)"
    );
}

//Menu compacto: una linea por producto
function construirMenuProductos(lista, carrito) {
    let menu = "CATALOGO (precios antes de IVA)\n";

    for(let i = 0; i < lista.lenghth; i++) {
        const producto = lista[i];
        const disponible = producto.stock - cantidadEnCarrito(carrito, producto.id);
        const estado = disponible > 0 ? "(" + disponible + ")" : "(agotado)";
        menu += (i + 1) + "." + producto.nombre + " " + formatoPesos(producto.precio) + " " + estado + "\n";
    }

    menu += "Escribe el numero del producto (1-" + lista.lenght + ")";
    return menu;
}

function construirListadoCarrito(carrito) {
    let texto = "";

    for (let i = 0; i < carrito.length; i++) {
        const item = carrito[i];
        texto += (i +1) + "." + item.nombre + "x" + item.cantidad  + "=" + formatoPesos(calcularImporte(item.precio, item.cantidad)) + "\n";
    }

    return texto;
}

// FASE 2 · PROCESAMIENTO - Funciones declaradas

function agregarAlCarrito(carrito, producto, cantidad) {
    const existente = carrito.find((item) => item.id === producto.id);

    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push ({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad,
        });
    }
}
 
// @param {Array} carrito -> @returns {number} suma de los importes
function calcularSubtotal(carrito) {
    let subtotal = 0;

    for (const item of carrito) {
        subtotal += calcularImporte(item.precio, item.cantidad);
    }

    return subtotal;
}

// Retorna el porcentaje del cupón o 0 si no existe
// @param {string} codigo -> @returns {number} % del cupón (0 si no existe)
function validarCupon(codigo) {
    const clave = codigo.toUpperCase();
    return CUPONES[clave] || 0;
}

// @param {Array} carrito, {Object|null} cupon -> @returns {Object} desglose completo de la compra
function calcularTotales(carrito, cupon) {
    const subtotal = calcularSubtotal(carrito);

    const porcentajeVolumen = obtenerPorcentajeVolumen(subtotal);
    const descuentoVolumen = calcularPorcentaje(subtotal, porcentajeVolumen);
    const tras1 = subtotal - descuentoVolumen;

    const porcentajeCupon = cupon ? cupon.porcentaje : 0;
    const descuentoCupon = calcularPorcentaje( tras1, porcentajeCupon);
    const baseGravable = tras1 - descuentoCupon;

    const iva = calcularPorcentaje (baseGravable, IVA);
    const envio = baseGravable >= ENVIO_GRATIS_DESDE ? 0 : ENVIO_BASE;
    const total = baseGravable + iva + envio;

    return {
        subtotal: subtotal, 
        porcentajeVolumen: porcentajeVolumen,
        descuentoVolumen: descuentoVolumen,
        porcentajeCupon: porcentajeCupon,
        descuentoCupon: descuentoCupon,
        baseGravable: baseGravable,
        iva: iva,
        envio: envio,
        total: total,
    };

}


function elegirMetodoPago(total) {
    const opcion = pedirEntero(
        "METODO DE PAGO\n" +
        "1. Efectivo contra entrega\n" +
        "2. Tarjeta debito\n" +
        "3. Tarjeta de credito (hasta 12 coutas)\n" +
        "Total a pagar: " + formatoPesos(total),
        1,
        3
    );

    if (opcion === null) {
        return null;
    }

    if (opcion === 1) {
        return { metodo: "Efectivo contra entrega", cuotas:1, recargo: 0, totalFinal: total, valorCuota: total };
    }

    if (opcion === 2) {
        return { metodo: "Tarjeta debito", cuotas: 1, recargo: 0, totalFinal: total, valorCuota: total };
    }

    const cuotas = pedirEntero("En cuantas cuotas? (1 a 12)\nMas de 6 cuotas tiene un recargo del 3%.", 1, 12);

    if (cuotas === null) {
        return null;
    }

    const recargo = cuotas > 6 ? calcularPorcentaje(total, 3) : 0;
    const totalFinal = total + recargo;

    return {
        metodo: "Tarjeta de credito",
        cuotas: cuotas,
        recargo: recargo,
        totalFinal: totalFinal,
        valorCuota: totalFinal / cuotas,
    };
}

function descontarStock(lista, carrito) {
    for (const item of carrito) {
        const producto = lista.find((p) => p.id === item.id);
        producto.stock -= item.cantidad;
    }
}

// FASE 3 · SALIDA DE RESULTADOS (consola + alert)

function mostrarCarrito(carrito) {
    if (carrito.length === 0) {
        alert("Tu carrito esta vacio. 🛍️");
        return;
    }

    console.log("--- TU CARRITO ---");
    console.table(
        carrito.map((item) => ({
            Producto: item.nombre,
            Cantidad: item.cantidad,
            "Precio unitario": formatoPesos(item.precio),
            Importe: formatoPesos(calcularImporte(item.precio, item.cantidad)),
        }))
    );

    alert(
        "🛍️ TU CARRITO\n\n" + construirListadoCarrito(carrito) + "\n" +
        "Subtotal:" + formatoPesos(calcularSubtotal(carrito))
    );
}

function mostrarFactura(pedido) {
    const { numero, cliente, direccion, carrito, totales, pago } = pedido;
    const envioTexto = totales.envio === 0 ? "GRATIS" : formatoPesos(totales.envio);

    console.log("======================================");
    console.log("FACTURA" + numero + "- LOLA BEAUTY" );
    console.log("Cliente: " + cliente);
    console.log("Direccion: " + direccion);
     console.log("======================================");

     console.table(
        carrito.map((item) => ({
            Producto: item.nombre,
            Cantidad: item.cantidad,
            "Precio unitario": formatoPesos(item.precio),
            Importe: formatoPesos(calcularImporte(item.precio, item.cantidad)),
        }))
     );

     console.log("Subtotal:" + formatoPesos(totales.subtotal));
     console.log("Descuento por volumen (" + totales.porcentajeVolumen + "%): -" + formatoPesos(totales.descuentoVolumen));
     console.log("Descuento por cupon (" + totales.porcentajeCupon + "%): -" + formatoPesos(totales.descuentoCupon));
     console.log("IVA (" + IVA + "%): +" + formatoPesos(totales.iva));
     console.log("Envio: " + envioTexto); 
     console.log("Recargo por coutas: + " + formatoPesos(pago.recargo));
     console.log("TOTAL A PAGAR: " + formatoPesos(pago.totalFinal));
     console.log("Pago: " + pago.metodo + " - " + pago.cuotas + " cuota(s) de " + formatoPesos(pago.valorCuota));


     alert(
        "🧾 FACTURA" + numero + "\n" +
        "Cliente: " + cliente + "\n" +
        "Direccion: " + direccion + "\n\n" +
        construirListadoCarrito(carrito) + "\n" +
        "Subtotal: " + formatoPesos(totales.subtotal) + "\n" +
        "Desc. volumen (" + totales.porcentajesVolumen + "%): -" + formatoPesos(totales.descuentoVolumen) + "/n" +
        "Desc. cupon (" + totales.porcentajeCupon + "%): -" + formatoPesos(totales.descuentoCupon) + "/n" +
        "IVA (" + IVA + "%): +" + formatoPesos(totales.iva) + "\n" +
        "Envio: " + envioTexto + "/n" +
        "Recargo por cuotas: +" + formatoPesos(pago.recargo) + "\n\n" +
        "TOTAL:" + formatoPesos(pago.totalFinal) + "\n" +
        pago.metodo + " - " + pago.cuotas + " cuota(s) de " + formatoPesos(pago.valorCuota) + "\n\n" +
        "Gracias por elegir LOLA Beauty!"

     );
}

// CONTROL DE FLUJO - Une las tres fases en cada opción del menú

function flujoAgregarProducto(lista, carrito) {
    const opcion = pedirEntero(construirMenuProductos(lista, carrito), 1, lista.length);

    if (opcion === null) {
        return;
    }

    const producto = lista[ opcion - 1];
    const disponible = producto.stock - cantidadEnCarrito(carrito, producto.id);

    if (disponible <= 0) {
        alert('Lo sentimos, "' + producto.nombre + ' " esta agotado. 😔');
        return;
    }

    const cantidad = pedirEntero(
        'Cuantas unidades de "' + producto.nombre + ' " deseas?\nDisponibles: ' + disponible,
        1,
        disponible
    );

    if (cantidad === null) {
        return;
    }

    agregarAlCarrito(carrito, producto, cantidad);
    console.log("Agregado: " + producto.nombre + "x" + cantidad);
    alert(producto.nombre + "x" + cantidad + "agregado al carrito.");
}

function flujoQuitarProducto(carrito) {
    if (carrito.length === 0) {
        alert("Tu carrito esta vacio, no hay nada que quitar.");
        return;
    }

    const opcion = pedirEntero(
        "Que producto deseas quitar?\n" + construirListadoCarrito(carrito) + "Escribe el numero (Cancelar para volver)",
        1,
        carrito.length
    );

    if (opcion === null) {
        return;
    }

    const eliminado = carrito.splice(opcion - 1, 1)[0];
    console.log("Eliminado: " + eliminado.nombre);
    alert('"' + eliminado.nombre + ' " fue quitado del carrito.');
}

//Retorna el cupon aplicado (o el que ya habia si el codigo es invalido)
function flujoAplicarCupon(cuponActual) {
    const codigo = pedirTexto("Escribe tu codigo de cupon");

    if (codigo === null) {
        return cuponActual;
    }

    const porcentaje = validarCupon(codigo);

    if (porcentaje === 0) {
        alert('El cupon "' + codigo + '" no es valido. ❌');
        return cuponActual;
    }

    alert("🎉  Cupon" + codigo.toUpperCase() + "aplicado: " + porcentaje + "% de descuento extra.");
    console.log("Cupon aplicado: " + codigo.toUpperCase() +  "(" + porcentaje + "%)");
    return { codigo: codigo.toUpperCase(), porcentaje: porcentaje };
}

// Retorna true si la compra se completo
function flujoFinalizarCompra(lista, carrito, cupon, nombre) {
    if (carrito.length === 0) {
        alert("Tu carrito esta vacio. Agrega productos antes de finalizar. ");
        return false;
    }

    const totales = calcularTotales(carrito, cupon);
    const envioTexto = totales.envio === 0 ? "GRATIS" : formatoPesos(totales.envio);

    const confirmar = confirmarSiNo(
    "RESUMEN\n" + construirListadoCarrito(carrito) +
    "Subtotal: " + formatoPesos(totales.subtotal) + "\n" +
    "Desc. volumen (" + totales.porcentajeVolumen + "%): -" + formatoPesos(totales.descuentoVolumen) + "\n" +
    "Desc. cupón (" + totales.porcentajeCupon + "%): -" + formatoPesos(totales.descuentoCupon) + "\n" +
    "IVA (" + IVA + "%): +" + formatoPesos(totales.iva) + "\n" +
    "Envío: " + envioTexto + "\n" +
    "Total:" + formatoPesos(totales.total) + "\n" +
    "¿Deseas continuar con el pago?"
  );

  if (!confirmar) {
    return false;
  }

  const direccion = pedirTexto("Escribe tu direccion de entrega:");
  if (direccion === null) {
    return false;
  }

  const pago = elegirMetodoPago(totales.total);
  if(pago === null) {
    return false;
  }

  const pedido = {
    numero: "LB-" + Date.now().toString().slice(-6),
    cliente: nombre,
    direccion: direccion,
    carrito: carrito,
    totales: totales,
    pago: pago,
  };

  mostrarFactura(pedido);
  descontarStock(lista, carrito);
  return true;
}

//Funcion principal

function iniciarSimulador(lista) {
     const carrito = [];
    let cupon = null;
    let compraFinalizada = false;
    let continuar = true;


    alert(
        "Bienvenida a LOLA Beauty!💄\n\n" +
        "• Descuento por volumen: 5% desde $100.000, 10% desde $200.000, 15% desde $300.000\n" +
        "• Envio gratis desde $150.000\n" +
        "• Cupones disponibles: LOLA100, BELLEZA5, PRIMERA15"

    );

    const nombre = pedirTexto("Como te llamas?");

    if (nombre === null) {
        alert("Simulador cancelado. Hasta pronto! 🌸");
        return;
    }

    //Ciclo Principal: se repite hasta finalizar la compra o salir

    while (continuar) {
        const opcion = pedirEntero(construirMenuPrincipal(nombre, carrito, cupon), 1, 5);

        if (opcion === null) {
            continuar = !confirmarSiNo("Seguro que deseas salir del simulador?");
        } else {
            switch (opcion) {
                case 1:
                    flujoAgregarProducto(lista, carrito);
                    break;
                    case 2:
                        mostrarCarrito(carrito);
                        break;
                        case 3:
                            flujoQuitarProducto(carrito);
                            break;
                            case 4:
                                cupon = flujoAplicarCupon(cupon);
                                break;
                                case 5:
                                    compraFinalizada = flujoFinalizarCompra(lista, carrito, cupon, nombre);
                                    continuar = !compraFinalizada;
                                    break;
            }

        }
    }

    if (!compraFinalizada) {
        console.log("Simulador finalizado sin completar la compra.");
        alert("Gracias por visitarnos, vuelve pronto. 🌸");
    }
}

// INVOCACIÓN DEL SIMULADOR
// Se ejecuta cuando la página termina de cargar.
// Para reiniciar la simulación, recarga la página (Cmd/Ctrl + R).

window.addEventListener("load", () => {
  try {
    iniciarSimulador(catalogo);
  } catch (error) {
    console.error("Error en el simulador:", error);
    alert("Ocurrió un error: " + error.message + "\nRevisa la consola para más detalles.");
}
});