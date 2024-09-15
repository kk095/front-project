export interface Product{
    id?: string;
    title: string;
    desc: string;
    imageUrl: string;
    category: string;
    subcategory: string;
    type: string;
}
export interface UploadProduct{
    title: string;
    desc: string;
    imageUrl: string;
    category: string;
    subcategory: string;
    type: string;
    file:File|null;
}

export interface Poster{
    id:string;
    imageUrl:string;
    alt:string;
}