import { Author } from "../author-list/author.model";
import { Editorial } from "../editorial-list/editorial.model";
import { Genre } from "../genre-list/genre.model";

export interface Book {
    idLibro: string | null;
    titulo: string | null;
    isbn: string | null;
    editorial: Editorial | null;
    anioPublicacion: number | null;
    idioma: string | null;
    descripcion: string | null;
    tipoMaterial: string | null;
    fechaRegistro: string | null;
    numPaginas: number | null;
    autores: Author[];
    generos: Genre[];
}