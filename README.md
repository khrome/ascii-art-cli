ascii-art-cl
============

A command line utility for [ascii-art](https://www.npmjs.com/package/ascii-art), now upgraded from the


Install
-------

This is a commandline module, which does not interact with a local directory, so it's perfectly suited for global install.

    npm install -g ascii-art-cl

Setup
-----
<table>
<tr><td valign="top">
<details><summary> OS X </summary>
<p>

Once installed, you can generate a configuration by running (though it will run without one)

```bash
    ascii-art-autoconfig
    ascii-art --help
```

which will (among other things) detect your theme and set an appropriate config.
Edits can be made by hand in `~/.ascii-artrc` or by using `ascii-art-config <key> <value>`

</p>
</details></td><td valign="top">
<details><summary> Linux </summary>
<p>

Once installed, you can generate a configuration by running (though it will run without one)

```bash
    ascii-art-autoconfig
    ascii-art --help
```

which will (among other things) detect your theme and set an appropriate config.
Edits can be made by hand in `~/.ascii-artrc` or by using `ascii-art-config <key> <value>`

</p>
</details></td><td valign="top">
<details><summary> Windows </summary>
<p>

```bash
    #sorry, no autoconfig for now
    ascii-art --help
```
</p>
</details>
</td></tr></table>


Help
----
Interactive instructions can be found using `ascii-art --help`

Documentation
-------------
Extended documentation can be found at [the ascii-art repo](https://github.com/khrome/ascii-art).
