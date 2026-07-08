import { Cliente } from "../models/cliente";
import { leerArchivo, guardarArchivo } from "../persistence/persistencia";
import { RUTA_CLIENTES } from "../persistence/rutas";

function validarCliente(cliente: Cliente): string | null {
  if (typeof cliente.id !== "number" || cliente.id <= 0) {
    return "El id del cliente debe ser un número mayor a 0.";
  }
  if (!cliente.nombre || cliente.nombre.trim() === "") {
    return "El nombre del cliente es obligatorio.";
  }
  if (!cliente.correo || !cliente.correo.includes("@")) {
    return "El correo del cliente no es válido.";
  }
  if (!cliente.telefono || cliente.telefono.trim() === "") {
    return "El teléfono del cliente es obligatorio.";
  }
  return null;
}

export async function listarClientes(): Promise<Cliente[]> {
  return leerArchivo<Cliente>(RUTA_CLIENTES);
}

export async function buscarCliente(id: number): Promise<Cliente | null> {
  const clientes = await leerArchivo<Cliente>(RUTA_CLIENTES);
  return clientes.find(c => c.id === id) || null;
}

export async function agregarCliente(cliente: Cliente): Promise<string | null> {
  const errorValidacion = validarCliente(cliente);
  if (errorValidacion) {
    return errorValidacion;
  }

  const clientes = await leerArchivo<Cliente>(RUTA_CLIENTES);

  if (clientes.some(c => c.id === cliente.id)) {
    return "Ya existe un cliente con ese id.";
  }

  clientes.push(cliente);
  const guardado = await guardarArchivo(RUTA_CLIENTES, clientes);

  return guardado ? null : "No se pudo guardar el cliente en el archivo.";
}

export async function actualizarCliente(
  id: number,
  datos: Partial<Cliente>
): Promise<boolean> {
  const clientes = await leerArchivo<Cliente>(RUTA_CLIENTES);
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) {
    return false;
  }

  const clienteActualizado = { ...cliente, ...datos };
  const errorValidacion = validarCliente(clienteActualizado);
  if (errorValidacion) {
    console.error(errorValidacion);
    return false;
  }

  Object.assign(cliente, datos);
  await guardarArchivo(RUTA_CLIENTES, clientes);
  return true;
}

export async function eliminarCliente(id: number): Promise<boolean> {
  const clientes = await leerArchivo<Cliente>(RUTA_CLIENTES);
  const index = clientes.findIndex(c => c.id === id);

  if (index === -1) {
    return false;
  }

  clientes.splice(index, 1);
  await guardarArchivo(RUTA_CLIENTES, clientes);
  return true;
}
