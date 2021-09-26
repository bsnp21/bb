
var Signin_help_respository = `

<ol>
<li>
    If you do not have have PAT, please <a
        href="https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token">generate
        Git Personal-Access-Token (PAT)</a>
</li>
<li>
    PAT is used to push data into repository (public or private), or
    pull data from private repository.
</li>
</ol>
`

var test = `
<div class="test" id='testPanel' style="display:none;">
<div class="center">
    <button onclick="PageUti.repo_create();">Dock</button>
    <button onclick="PageUti.repo_destroy(1);">Undock(force)</button>
    <button onclick="PageUti.repo_destroy(0);">Undock(safe)</button>
    <button onclick="PageUti.repo_pushback(1);">push(force)</button>
    <button onclick="PageUti.repo_pushback(0);">push(safe)</button>
    <button onclick="PageUti.repo_pulldown(1);">pull(force)</button>
    <button onclick="PageUti.repo_pulldown(0);">pull(safe)</button>
    <button onclick="PageUti.repo_status(1);">Status(force)</button>
    <button onclick="PageUti.repo_status(0);">Status(safe)</button>
    <br>
    <a onclick="PageUti.gen_cmdline_table('#account_history');">CmdLines</a> |
    <a onclick="Okey_use_this();">SetParent</a> |
    <a onclick="PageUti.LoadStorageInRepos('#account_history');">LoadStorage</a>

    <a class="help_label" onclick="$('#DocBtnExplaination').toggle()">help?</a>

</div>
<div id="DocBtnExplaination" class="helpinfo">
    <ul>
        Thinking of your repository as a ship, BSNP server as riverbank.
        <li><b>Dock</b>: Your repository ties/clone at BSNP server. You can read/write.</li>
        <li><b>Undock</b>: Your repository leaves BSNP server. Your data at BSNP server will be erased. No
            one can view your data anymore.</li>
        <li><b>Push</b>: to push data to your repository during docked.</li>
        <li><b>Pull</b>: to pull data from your repository during docked.</li>
    </ul>
</div>
</div>

<p>
<a onclick="LoadStorageInRepos();"></a>
<a onclick="LoadStorage();"></a>
</p>
<p>

</p>
`