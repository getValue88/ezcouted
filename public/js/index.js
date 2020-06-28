const $usageLinks = document.querySelectorAll('.usageLink');
const $playersLinks = document.querySelectorAll('.playersLink');
const $main = document.querySelector('.main-content');

//FUNCTIONS
const renderPokemonStats = data => {
    if (data) {
        data.sort((a, b) => {
            return parseFloat(a.usage) < parseFloat(b.usage) ? 1 : -1;
        });

        $main.innerHTML = `
            <table class="content-table">
                <tr>
                    <th>POKEMON</th>
                    <th>TOTAL GAMES</th>
                    <th>WINRATE</th>
                    <th>USAGE</th>
                </tr>     
        `;

        data.forEach(el => {
            let cssClass = '';
            if (parseFloat(el.winrate) > 55) {
                cssClass = ' pkmHighRate';
            } else if (parseFloat(el.winrate) < 45) {
                cssClass = ' pkmLowRate';
            }

            const markup = `
                <tr class="item">
                    <td class="pkmName">${el.pokemon.charAt(0).toUpperCase() + el.pokemon.slice(1)}</td>
                    <td class="totalGames">${el.games}</td>
                    <td class="winrate${cssClass}">${el.winrate}%</td>
                    <td class="usage">${el.usage}%</td>
                </tr>
            `;

            document.querySelector('.content-table').insertAdjacentHTML('beforeend', markup);
        });

        $main.innerHTML += '</table>';
    }
};

const renderPlayerStat = (data, tier) => {
    if (data) {
        data.sort((a, b) => {
            return parseInt(a.gamesPlayed) < parseInt(b.gamesPlayed);
        });

        $main.innerHTML = `
            <table class="content-table">
                <tr>
                    <th>PLAYER</th>
                    <th>TOTAL GAMES</th>
                    <th>W - L</th>
                    <th>WINRATE</th>
                </tr>     
        `;

        data.forEach(el => {
            let cssClass = '';
            if (parseFloat(el.winrate) > 65) {
                cssClass = ' plyHighRate';
            }

            const markup = `
                <tr class="item">      
                    <td class="plyName">
                        <a href="players/${tier}/${el.player}" class="playerInfo"> ${el.player.charAt(0).toUpperCase() + el.player.slice(1)}</a>
                    </td> 
                    <td class="totalGames">${el.gamesPlayed}</td>
                    <td class="wl">${el.winsLoses}</td>
                    <td class="plyWR${cssClass}">${el.winrate}%</td>
                </tr>
               
            `;

            document.querySelector('.content-table').insertAdjacentHTML('beforeend', markup);

            $main.innerHTML += '</table>';
        });

        const playerInfoLink = document.querySelectorAll('.playerInfo');

        //add events to the dinamic links
        playerInfoLink.forEach(link => {
            link.addEventListener('click', async e => {
                e.preventDefault();
                const data = await fetch(e.target.href);
                const jsonData = await data.json();
                renderPlayerInfo(jsonData, tier);
            });
        });
    }
};

const renderPlayerInfo = (data, tier) => {
    if (data) {

        //sort by date
        data.sort((a, b) => {
            const dateArrA = a.date.split('/');
            const dateArrB = b.date.split('/');
            return new Date('20' + dateArrA[1], dateArrA[0] - 1, 01) < new Date('20' + dateArrB[1], dateArrB[0] - 1, 01);
        });

        $main.innerHTML = `
            <h1><b><u>${data[0].player.charAt(0).toUpperCase() + data[0].player.slice(1)}</u></b></h1>
            <table class="content-table">
                
                <tr>
                    <th>DATE</th>
                    <th>PARTY 1</th>
                    <th>PARTY 2</th>
                    <th>PARTY 3</th>
                    <th>PARTY 4</th>
                    <th>PARTY 5</th>
                    <th>PARTY 6</th>
                    <th>W - L</th>
                </tr>     
        `;

        data.forEach(el => {
            const markup = `               
                <tr class="item">                    
                    <td class="date">${el.date.replace('_', '/')}</td>                   
                    <td class="party">${el.p1.charAt(0).toUpperCase() + el.p1.slice(1)}</td>
                    <td class="party">${el.p2.charAt(0).toUpperCase() + el.p2.slice(1)}</td>
                    <td class="party">${el.p3.charAt(0).toUpperCase() + el.p3.slice(1)}</td>
                    <td class="party">${el.p4.charAt(0).toUpperCase() + el.p4.slice(1)}</td>
                    <td class="party">${el.p5.charAt(0).toUpperCase() + el.p5.slice(1)}</td>
                    <td class="party">${el.p6.charAt(0).toUpperCase() + el.p6.slice(1)}</td>
                    <td class="result">${el.result.toUpperCase()}</td>
                </tr>
               
            `;

            document.querySelector('.content-table').insertAdjacentHTML('beforeend', markup);

            $main.innerHTML += '</table>';
        });
    }
};


//EVENTS
$usageLinks.forEach(link => {
    link.addEventListener('click', async e => {
        e.preventDefault();
        const data = await fetch(e.target.href);
        const jsonData = await data.json();
        renderPokemonStats(jsonData);
    });
});

$playersLinks.forEach(link => {
    link.addEventListener('click', async e => {
        e.preventDefault();
        const tier = e.target.href.slice(e.target.href.length - 2);
        const data = await fetch(e.target.href);
        const jsonData = await data.json();
        renderPlayerStat(jsonData, tier);
    });
});

