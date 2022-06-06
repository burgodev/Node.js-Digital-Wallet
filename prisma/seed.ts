import { Prisma } from "@prisma/client";
import { prisma } from "../src/helpers/db";
import { formatDateToDB } from "../src/helpers/general";
import { document_types } from "./seed-data/document-types";
import { countries } from "./seed-data/countries";
import { roles } from "./seed-data/roles";
import { transaction_types } from "./seed-data/transaction-type";
import { users } from "./seed-data/users";

const documentTypes = async () => {
    const data: Prisma.DocumentTypeCreateInput[] = document_types;

    data.forEach(async (d) => {
        await prisma.documentType.upsert({
            where: {
                name: d.name,
            },
            create: d,
            update: {},
        });
    });
};

const createCountries = async () => {
    const data: Prisma.CountryCreateInput[] = countries;

    data.forEach(async (c) => {
        await prisma.country.upsert({
            where: {
                iso_code: c.iso_code,
            },
            create: c,
            update: {},
        });
    });
};

const createRoles = async () => {
    const data: Prisma.RoleCreateInput[] = roles.map((r) => ({
        name: r.name,
        roleDocumentType: {
            create: r.necessary_documents.map((nd) => ({
                document_type: {
                    connect: { name: nd.name },
                },
            })),
        },
    }));

    data.forEach(async (r) => {
        await prisma.role.upsert({
            where: {
                name: r.name,
            },
            create: r,
            update: {},
        });
    });
};

const createAcceptanceTerm = async () => {
    const acceptance_terms: Prisma.AcceptanceTermCreateInput[] = [
        {
            id: "f6868f30-188f-4406-9a97-c85dfd4260a4",
            content: "TERMS OF USE VERIFY THESE CONDITIONS BELOW...",
            is_active: true,
            expiry_date: new Date(2025, 1, 10),
            created_by: "...",
        },
    ];

    acceptance_terms.forEach(async (c) => {
        await prisma.acceptanceTerm.upsert({
            where: {
                id: c.id,
            },
            create: c,
            update: {},
        });
    });
};

const createTransactionType = async () => {
    const transaction_type: Prisma.TransactionTypeCreateInput[] = transaction_types;

    transaction_type.forEach(async (t) => {
        await prisma.transactionType.upsert({
            where: {
                name: t.name,
            },
            create: t,
            update: {},
        });
    });
};

const createAdminUser = async () => {
    const default_users: Prisma.UserCreateInput[] = users.map((u) => ({
        email: u.email,
        first_name: u.first_name,
        last_name: u.last_name,
        email_checked_at: formatDateToDB(new Date()),
        userRoles: {
            create: {
                password: u.password,
                status: "ACTIVE",
                role: {
                    connect: {
                        name: u.role,
                    },
                },
            },
        },
    }));

    default_users.forEach(async (u) => {
        await prisma.user.upsert({
            where: {
                email: u.email,
            },
            create: u,
            update: {
                first_name: u.first_name,
                last_name: u.last_name,
            },
        });
    });
};

async function main() {
    await documentTypes();
    await createCountries();
    await createAcceptanceTerm();
    await createTransactionType();

    setTimeout(async () => await createRoles());
    setTimeout(async () => await createAdminUser());
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
