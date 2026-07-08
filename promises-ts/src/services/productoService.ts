import { Producto } from "../models/producto";
import { leerArchivo, guardarArchivo } from "../persistence/persistencia";
import { RUTA_PRODUCTOS } from "../persistence/rutas";

function validarProducto(producto: Producto): string | null {
  if (!producto.codigo || producto.codigo.trim() === "") {
    return "El código del producto es obligatorio.";
  }
  if (!producto.nombre || producto.nombre.trim() === "") {
    return "El nombre del producto es obligatorio.";
  }
  if (typeof producto.precio !== "number" || producto.precio < 0) {
    return "El precio debe ser un número mayor o igual a 0.";
  }
  if (typeof producto.stock !== "number" || producto.stock < 0) {
    return "El stock debe ser un número mayor o igual a 0.";
  }
  return null;
}

export async function listarProductos(): Promise<Producto[]> {
  return leerArchivo<Producto>(RUTA_PRODUCTOS);
}

export async function buscarProducto(codigo: string): Promise<Producto | null> {
  const productos = await leerArchivo<Producto>(RUTA_PRODUCTOS);
  return productos.find(p => p.codigo === codigo) || null;
}

export async function agregarProducto(producto: Producto): Promise<string | null> {
  const errorValidacion = validarProducto(producto);
  if (errorValidacion) {
    return errorValidacion;
  }

  const productos = await leerArchivo<Producto>(RUTA_PRODUCTOS);

  if (productos.some(p => p.codigo === producto.codigo)) {
    return "Ya existe un producto con ese código.";
  }

  productos.push(producto);
  const guardado = await guardarArchivo(RUTA_PRODUCTOS, productos);

  return guardado ? null : "No se pudo guardar el producto en el archivo.";
}

export async function actualizarProducto(
  codigo: string,
  datos: Partial<Producto>
): Promise<boolean> {
  const productos = await leerArchivo<Producto>(RUTA_PRODUCTOS);
  const producto = productos.find(p => p.codigo === codigo);

  if (!producto) {
    return false;
  }

  const productoActualizado = { ...producto, ...datos };
  const errorValidacion = validarProducto(productoActualizado);
  if (errorValidacion) {
    console.error(errorValidacion);
    return false;
  }

  Object.assign(producto, datos);
  await guardarArchivo(RUTA_PRODUCTOS, productos);
  return true;
}

export async function eliminarProducto(codigo: string): Promise<boolean> {
  const productos = await leerArchivo<Producto>(RUTA_PRODUCTOS);
  const index = productos.findIndex(p => p.codigo === codigo);

  if (index === -1) {
    return false;
  }

  productos.splice(index, 1);
  await guardarArchivo(RUTA_PRODUCTOS, productos);
  return true;
}
