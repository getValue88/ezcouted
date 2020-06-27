const express = require('express');
const router = new express.Router();
const Team = require('../models/Team');
const { db } = require('../models/Team');

//INSERT TEAMS BY TIER
router.post('/teams/:tier', (req, res) => {

    if (req.user.role !== 'Admin') {
        return res.status(401).send();
    }

    const tier = req.params.tier.toLowerCase();
    if (tier !== 'ou' && tier !== 'uu' && tier !== 'nu' && tier !== 'db' && tier !== 'lc') {
        return res.status(400).send('Wrong Tier');
    }

    const rawData = req.body.data.split('-').map(row => row.split(','));
    const teams = rawData.map(team => {
        return new Team({
            player: team[0],
            result: team[1],
            p1: team[2],
            p2: team[3],
            p3: team[4],
            p4: team[5],
            p5: team[6],
            p6: team[7],
            date: team[8]
        });
    });

    db.collection(tier).insertMany(teams)
        .then(documents => res.status(201).send(documents.ops))
        .catch(err => res.status(400).send(err));
});

//GET USAGE STATS BY TIER => [{pkm,games,usage,winrate}]
router.get('/usage/:tier', async (req, res) => {
    const tier = req.params.tier.toLowerCase();
    if (tier !== 'ou' && tier !== 'uu' && tier !== 'nu' && tier !== 'db' && tier !== 'lc') {
        return res.status(400).send('Wrong Tier');
    }

    const teams = [];
    const singleMons = [];
    const count = [];
    const wins = [];

    let totalTeams;
    let winOrLose;

    //get all teams
    const allMons = await db.collection(tier).find({}).toArray()
        .catch(err => res.status(500).send('Failed to fetch request', err));

    //count teams
    totalTeams = allMons.length;

    //push results and all monst into an array
    allMons.forEach(team => {
        teams.push(team.result, team.p1, team.p2, team.p3, team.p4, team.p5, team.p6);
    });


    teams.forEach(el => {
        //check if element is a result
        if (el === 'l') winOrLose = 0;
        if (el === 'w') winOrLose = 1;

        //if element doesnt exists in singlemons isn't a result
        if (!singleMons.includes(el) && el !== 'l' && el !== 'w') {
            singleMons.push(el);
            count.push(1);
            wins.push(winOrLose);

            //if element exists in singlemons
        } else if (el !== 'l' && el !== 'w') {
            count[singleMons.indexOf(el)]++;
            wins[singleMons.indexOf(el)] += winOrLose;
        }
    });

    //format json response
    const response = singleMons.map((mon, i) => {
        return {
            pokemon: mon,
            games: count[i],
            usage: ((count[i] / totalTeams) * 100).toFixed(2),
            winrate: ((wins[i] / count[i]) * 100).toFixed(2)
        }
    });

    res.status(200).send(response);
});

//GET PLAYERS STATS BY TIER
router.get('/players/:tier', async (req, res) => {
    const tier = req.params.tier.toLowerCase();
    if (tier !== 'ou' && tier !== 'uu' && tier !== 'nu' && tier !== 'db' && tier !== 'lc') {
        return res.status(400).send('Wrong Tier');
    }

    const allTeams = await db.collection(tier).find({}).toArray();

    const players = [];
    const gamesCount = [];
    const wins = [];
    let winOrLose;

    //filter multiple occurrences, sum games and wins
    allTeams.forEach(team => {
        if (team.result === 'l') winOrLose = 0;
        if (team.result === 'w') winOrLose = 1;

        if (!players.includes(team.player)) {
            players.push(team.player);
            gamesCount.push(1);
            wins.push(winOrLose);

        } else {
            gamesCount[players.indexOf(team.player)]++;
            wins[players.indexOf(team.player)] += winOrLose;
        }
    });

    //format json response
    const response = players.map((player, i) => {
        return {
            player: player,
            gamesPlayed: gamesCount[i],
            winsLoses: `${wins[i]} - ${gamesCount[i] - wins[i]}`,
            winrate: ((wins[i] / gamesCount[i]) * 100).toFixed(2)
        }
    });

    res.status(200).send(response);
});

//GET PLAYER TEAMS BY TIER AND NAME
router.get('/players/:tier/:name', async (req, res) => {
    const tier = req.params.tier.toLowerCase();
    if (tier !== 'ou' && tier !== 'uu' && tier !== 'nu' && tier !== 'db' && tier !== 'lc') {
        return res.status(400).send('Wrong Tier');
    }

    const player = req.params.name.toLowerCase();
    const playerTeams = await db.collection(tier).find({ player: player }).toArray();

    res.status(200).send(playerTeams);
});


module.exports = router;