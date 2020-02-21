const fs = require('fs');

const core = require('@actions/core');
const { GitHub } = require('@actions/github');

function listFiles(dir, files, walk) {
    let items = fs.readdirSync(dir),
        dirsToList = [];

    // Loop over each item in the directory
    items.forEach(item => {

        // get the absolute path and lstat info for the directory item
        let itemPath = path.join(dir, item),
            stat = fs.lstatSync(itemPath);

        // if the item is a file
        if (stat.isFile()) {

            // Replace spaces in file name with -
            // this is because github assets cannot contain spaces
            let assetName = item.replace(/ /g, '-');

            // if their is already a file stored with the asset name
            if (files.hasOwnProperty(assetName)) {
                throw new Error(`duplicate file: ${item}`);
            }

            files[assetName] = {
                path: itemPath,
                size: stat.size
            };

        // item is a directory that should be walked
        } else if (walk && stat.isDirectory()) {
            dirsToList.push(itemPath);
        }
    });

    if (walk) {
        dirsToList.forEach(dir => listFiles(dir, files, walk));
    }
}

module.exports = async function uploadReleaseDir() {
    try {

        // Get inputs
        const url  = core.getInput('url',  { required: true });
        const walk = core.getInput('walk') || false;
        let dir = core.getInput('dir', { required: true });
        

        // validate dir
        if (
            dir == null ||
            dir == '' ||
            (dir = path.join(process.cwd(), dir)) === process.cwd() ||
            !fs.existsSync(dir) ||
            !fs.lstatSync(dir).isDirectory()
        ) {
            throw new Error('invalid directory');
        }

        // build a list of files in the directory
        let files = {};
        listFiles(dir, files, walk);

        // No files to upload
        if (Object.keys(files).length === 0) {
            throw new Error('no files to upload');
        }

        // Login to github
        const github = new GitHub(process.env.GITHUB_TOKEN);

        let uploaded = [],
            errored = []

        Object.keys(files).forEach(name => {
            let filePath = files[name].path,
                fileSize = files[name].size;

            try {

                // attempt to upload the file
                let result = (await github.repos.uploadReleaseAsset({
                    url,
                    headers: { 'content-length': fileSize, 'content-type': 'application/octet-stream'},
                    name,
                    file: fs.readFileSync(filePath)
                })).data;

                // successful: store the result
                uploaded.push({path: filePath, name, url: result.browser_download_url });

            // on error, store the error
            } catch (e) {
                errored.push({path: filePath, error: e.message});
            }
        });

        core.setOutput('uploads', JSON.stringify(uploaded));
        core.setOutput('errored', JSON.stringify(errored));

        if (errored.length) {
            core.setFailed('failed to upload one or more files');
        }

    } catch (e) {
        core.setFailed(e.message);
    }
};