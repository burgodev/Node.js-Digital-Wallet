const fs = require("fs/promises");

const i18n_path = `./src/i18n`;
const var_name = "t_schema";
const path = [];

const getData = async (dir) => {
    const json = await fs.readFile(dir);
    return JSON.parse(json);
};

const format = (obj) => {
    return Object.entries(obj).map(([k, v]) => {
        path.push(k);
        if (typeof v == "object") {
            v = format(v).reduce((p, c) => {
                return { ...p, ...c };
            }, v);
        } else if (typeof v == "string") {
            v = path.join(".");
        }
        path.pop();

        return { [k]: v };
    });
};

const exec = async () => {
    const data = await getData(`${i18n_path}/en.json`);
    const result = format(data).reduce((p, c) => {
        return { ...p, ...c };
    }, {});

    const content = `
        const ${var_name} = ${JSON.stringify(result)}; 
        export default ${var_name};
    `.trim();

    await fs.writeFile(`${i18n_path}/mock.ts`, content);
};

exec()
    .then(() => {
        console.log("i18n migration succeeded");
    })
    .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
