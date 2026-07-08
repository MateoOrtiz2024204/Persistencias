import { rl } from "../utils/readline";
import {
  listarProductos,
  buscarProducto,
  agregarProducto,
  actualizarProducto,
  eliminarProducto
} from "../services/productoService";
import {
  listarClientes,
  buscarCliente,
  agregarCliente,
  actualizarCliente,
  eliminarCliente
} from "../services/clienteService";

function preguntar(pregunta: string): Promise<string> {
  return new Promise(resolve => rl.question(pregunta, resolve));
}

export async function menu(): Promise<void> {
  console.log("\n===== MENU =====");

  console.log("\n--- PRODUCTOS ---");
  console.log("1. Agregar producto");
  console.log("2. Listar productos");
  console.log("3. Buscar producto");
  console.log("4. Actualizar producto");
  console.log("5. Eliminar producto");

  console.log("\n--- CLIENTES ---");
  console.log("6. Agregar cliente");
  console.log("7. Listar clientes");
  console.log("8. Buscar cliente");
  console.log("9. Actualizar cliente");
  console.log("10. Eliminar cliente");

  console.log("\n0. Salir");

  const opcion = await preguntar("\nSeleccione una opción: ");

  switch (opcion) {
    case "1": {
      const codigo = await preguntar("Código: ");
      const nombre = await preguntar("Nombre: ");
      const precio = await preguntar("Precio: ");
      const stock = await preguntar("Stock: ");

      const error = await agregarProducto({
        codigo,
        nombre,
        precio: Number(precio),
        stock: Number(stock)
      });

      console.log(error ? `Error: ${error}` : "Producto agregado");
      await menu();
      break;
    }

    case "2": {
      const productos = await listarProductos();
      console.log(JSON.stringify(productos, null, 2));
      await menu();
      break;
    }

    case "3": {
      const codigo = await preguntar("Código: ");
      const producto = await buscarProducto(codigo);
      console.log(producto ? JSON.stringify(producto, null, 2) : "Producto no encontrado");
      await menu();
      break;
    }

    case "4": {
      const codigo = await preguntar("Código del producto: ");
      const nombre = await preguntar("Nuevo nombre: ");
      const precio = await preguntar("Nuevo precio: ");
      const stock = await preguntar("Nuevo stock: ");

      const actualizado = await actualizarProducto(codigo, {
        nombre,
        precio: Number(precio),
        stock: Number(stock)
      });

      console.log(actualizado ? "Producto actualizado" : "Producto no encontrado o datos inválidos");
      await menu();
      break;
    }

    case "5": {
      const codigo = await preguntar("Código: ");
      const eliminado = await eliminarProducto(codigo);
      console.log(eliminado ? "Producto eliminado" : "Producto no encontrado");
      await menu();
      break;
    }

    case "6": {
      const id = await preguntar("ID: ");
      const nombre = await preguntar("Nombre: ");
      const correo = await preguntar("Correo: ");
      const telefono = await preguntar("Teléfono: ");

      const error = await agregarCliente({
        id: Number(id),
        nombre,
        correo,
        telefono
      });

      console.log(error ? `Error: ${error}` : "Cliente agregado");
      await menu();
      break;
    }

    case "7": {
      const clientes = await listarClientes();
      console.log(JSON.stringify(clientes, null, 2));
      await menu();
      break;
    }

    case "8": {
      const id = await preguntar("ID: ");
      const cliente = await buscarCliente(Number(id));
      console.log(cliente ? JSON.stringify(cliente, null, 2) : "Cliente no encontrado");
      await menu();
      break;
    }

    case "9": {
      const id = await preguntar("ID del cliente: ");
      const nombre = await preguntar("Nuevo nombre: ");
      const correo = await preguntar("Nuevo correo: ");
      const telefono = await preguntar("Nuevo teléfono: ");

      const actualizado = await actualizarCliente(Number(id), {
        nombre,
        correo,
        telefono
      });

      console.log(actualizado ? "Cliente actualizado" : "Cliente no encontrado o datos inválidos");
      await menu();
      break;
    }

    case "10": {
      const id = await preguntar("ID: ");
      const eliminado = await eliminarCliente(Number(id));
      console.log(eliminado ? "Cliente eliminado" : "Cliente no encontrado");
      await menu();
      break;
    }

    case "0":
      rl.close();
      break;

    default:
      console.log("Opción no válida");
      await menu();
  }
}
