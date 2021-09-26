
var Signin_help_respository = `
<ol>

<li>
    Log into your <a href="https://github.com/">github.com</a> account. If you don't have it, please
    see
    <a href="https://www.youtube.com/embed/hMfi_ONvGEs?start=40&end=56&autoplay=1">how @0:40</a>.
</li>
<li>
    Open your respository, then copy its https-url (click green button ["Clone or download"], then
    click
    <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-clippy"
        aria-label="The clipboard icon" role="img">
        <path fill-rule="evenodd"
            d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z">
        </path>
    </svg>, see <a href="https://www.youtube.com/embed/X5e3xQBeqf8?start=120&end=134&autoplay=1">how
        @2:05</a>).
    If you don't have it, please create a 'New repository', see <a
        href="https://www.youtube.com/embed/hMfi_ONvGEs?start=103&end=180&autoplay=1">how
        @1:40</a>, 'public' is recommended.)



    <br><br>
    <a onclick="$('#FormatOfRepository').toggle('slow');">[Repository https-url Formats:]
    </a><em>https://github.com/usrname/repositoryname.git</em>

    <table border='1' id="FormatOfRepository">
        <caption>Repository https-url Formats</caption>
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Format</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>full https url</td>
                <td>https://github.com/usrname/repositoryname.git
                </td>
            </tr>
            <tr>
                <td>2</td>
                <td>user-repos<br>compound IDs</td>
                <td>usrname/repositoryname</td>
            </tr>
            <tr>
                <td>3</td>
                <td>*(todo)</td>
                <td>
                    <a
                        href="https://git-scm.com/docs/git-clone">http[s]://host.xz[:port]/path/to/repo.git/</a>
                </td>
            </tr>
        </tbody>

    </table>
</li>

</ol>

`