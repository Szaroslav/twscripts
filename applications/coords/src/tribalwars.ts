const TribalWars = {
    URL: 'plemiona.pl',

    getActiveServers: async function () {
        const res = await fetch(`https://szaredko.com/tribal-wars/app/coords/api/servers/pl/active/`);
        const resBody = await res.json();
        console.log(resBody);
    },
};

export default TribalWars;
