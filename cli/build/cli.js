#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { node } from './node.js';
import { DockerService } from './docker.js';
const docker = new DockerService();
yargs(hideBin(process.argv))
    .command('db:backup', 'backup database to the spaces bucket in digital ocean', (yargs) => {
    return yargs
        .option('db', {
        describe: 'optional name of the database. leave empty when backing up public/live db',
        default: 'public'
    })
        .option('name', {
        describe: 'optional name of the backup default is img-backup-latest',
        default: 'img-backup-latest'
    });
}, async (argv) => {
    const res = await node('backup', { db: argv.db, name: argv.name });
    process.stdout.write(JSON.stringify(res) + '\n');
})
    .command('db:prepare [db]', 'prepare database for data entry', (yargs) => {
    return yargs
        .positional('db', {
        describe: 'the name of the database, for example img1'
    })
        .option('source', {
        describe: 'the name of the backup used. defaults to img-backup-latest',
        default: 'img-backup-latest'
    });
}, async (argv) => {
    const res = await node('prepare', { db: argv.db, source: argv.source });
    process.stdout.write(JSON.stringify(res) + '\n');
})
    .command('db:stage [db]', 'connect staging dashboard to this database', (yargs) => {
    return yargs
        .positional('db', {
        describe: 'the name of the database, for example img1'
    });
}, async (argv) => {
    const res = await node('stage', { db: argv.db });
    process.stdout.write(JSON.stringify(res) + '\n');
})
    .command('db:publish [db]', 'promote staging database to public', (yargs) => {
    return yargs;
}, async (argv) => {
    const res = await node('publish', {});
    process.stdout.write(JSON.stringify(res) + '\n');
})
    .command('db:dev [db]', 'connect dev dashboard to this database', (yargs) => {
    return yargs
        .positional('db', {
        describe: 'the name of the database, for example img1'
    });
}, async (argv) => {
    const res = await node('dev', { db: argv.db });
    process.stdout.write(JSON.stringify(res) + '\n');
})
    .command('data:entry [week]', 'import data from csv', (yargs) => {
    return yargs
        .positional('week', {
        describe: 'week number'
    })
        .option('topic', {
        describe: 'the name of the data category, one of: fs,ves,kto,mss,wdims',
        default: 'all'
    })
        .option('db', {
        describe: 'name of the db',
        default: 'img_new'
    });
}, async (argv) => {
    const db = (argv.db == null) ? "img_" + argv.week : argv.db;
    const res = await node('data_entry', { week: argv.week, topic: argv.topic, db });
    process.stdout.write(JSON.stringify(res));
})
    .command('api:view [name] [db]', 'add the public read permissions for a new api endpoint', (yargs) => {
    return yargs
        .positional('name', {
        describe: 'the name of the api view'
    })
        .positional('db', {
        describe: 'the db for which to add the view'
    });
}, async (argv) => {
    const res = await node('api_view', { name: argv.name, db: argv.db });
    process.stdout.write(JSON.stringify(res));
})
    // Enable strict mode.
    .strict()
    // Useful aliases.
    .alias({ h: 'help' })
    .argv;
