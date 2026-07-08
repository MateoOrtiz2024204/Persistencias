import { readFile, writeFile } from "fs/promises";

export async function leerArchivo<T>(ruta: string): Promise<T[]> {
  try {
    const contenido = await readFile(ruta, "utf-8");
    const datos = JSON.parse(contenido);

    if (!Array.isArray(datos)) {
      console.error(`El archivo ${ruta} no contiene un arreglo válido.`);
      return [];
    }

    return datos as T[];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.log(`El archivo ${ruta} no existe todavía. Se iniciará vacío.`);
    } else if (error instanceof SyntaxError) {
      console.error(`El archivo ${ruta} contiene JSON inválido: ${error.message}`);
    } else {
      console.error(`Error al leer el archivo ${ruta}: ${error.message}`);
    }
    return [];
  }
}

export async function guardarArchivo<T>(ruta: string, datos: T[]): Promise<boolean> {
  try {
    const contenido = JSON.stringify(datos, null, 2);
    await writeFile(ruta, contenido, "utf-8");
    return true;
  } catch (error: any) {
    console.error(`Error al guardar el archivo ${ruta}: ${error.message}`);
    return false;
  }
}
