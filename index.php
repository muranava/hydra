<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css"/>
        <link rel="stylesheet" type="text/css" href="css/style.css"/>
    </head>
    <body>
        <div class="container">
            <form method="get" id="search">
                <div class="input-group">
                    <input class="form-control" placeholder="Pattern..." name="pattern">
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="submit">Go!</button>
                    </span>
                </div>
            </form>
            <a id="feedback" target="_blank">Contact via e-mail</a>
            <div id="playerwrapper">
                <div id="player">YouTube player</div>
            </div>
            <div id="results">
            </div>
        </div>
    </body>
    <script type="text/javascript" src="js/lib/swfobject.js"></script>
    <script type="text/javascript" src="js/main.min.js"></script>
</html>
