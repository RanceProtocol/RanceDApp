export interface IDatabaseWrapper {
    find(query: object): any;
    insertOne(data: any): any;
}
