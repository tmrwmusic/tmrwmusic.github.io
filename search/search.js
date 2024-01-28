async function placeholderReplace() {
    var songs = await fetch("../s/songs.json").then(response => response.json());
    var artists = await fetch("../a/artists.json").then(response => response.json());
    var releases = await fetch("../r/releases.json").then(response => response.json());

    var prompts = [];
    for (const artist in artists) {
        prompts.push(artist);
        if (artist !== "FlyJungeMraza") {
            prompts.push(artists[artist][0].portfolioLINK);
        }
    }
    for (const release of releases) {
        prompts.push(release.id);
        prompts.push(release.title);
    }
    for (const song in songs) {
        prompts.push(song);
        prompts.push(songs[song].title);
    }
    
    var input = document.querySelector('search>input[type="text"]');
    var randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    input.placeholder = randomPrompt;
}
