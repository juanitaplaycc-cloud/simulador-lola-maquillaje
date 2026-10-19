LOLA Beauty · Simulador de Compras de Maquillaje
Proyecto de la Pre-Entrega 3: Funciones e Integración de Lógica (Coderhouse · JavaScript).
Simulador de una tienda de maquillaje que se ejecuta con prompt (entrada de datos), alert y consola (salida de resultados).
Cómo ejecutarlo
Clona o descarga el repositorio.
Abre index.html en un navegador real (Chrome, Safari o Firefox). La vista previa integrada de VS Code no soporta prompt().
El simulador inicia al cargar la página. Para reiniciarlo, recarga con Cmd/Ctrl + R.
Abre la consola (F12) para ver el detalle del carrito y la factura.
Estructura
├── index.html   # Página con el catálogo y los beneficios
├── main.js      # Lógica del simulador (funciones)
└── README.md
Qué hace el simulador
Pide el nombre del cliente.
Menú principal: agregar productos, ver carrito, quitar productos, aplicar cupón y finalizar compra.
Control de stock por producto.
Descuento por volumen (5 %, 10 % y 15 %) y cupones (LOLA100, BELLEZA5, PRIMERA15).
IVA del 19 %, envío gratis desde $150.000 y recargo del 3 % en crédito a más de 6 cuotas.
Factura final en alert y en consola.
