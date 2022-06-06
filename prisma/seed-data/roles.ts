import { document_types } from "./document-types";

export const roles = [
    {
        name: "Client",
        necessary_documents: [document_types[0], document_types[1]],
    },
    {
        name: "Manager",
        necessary_documents: document_types,
    },
    {
        name: "Admin",
        necessary_documents: [],
    },
    {
        name: "Business",
        necessary_documents: [],
    },
    {
        name: "Support",
        necessary_documents: [],
    },
];
