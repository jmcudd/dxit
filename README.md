# dxit

Very simple way of sharing a file or directory with a friend instantly

## Example Usage

```
dxit -f myface.jpeg
dxit -d ./myphotos
dxit -p 7000 -f myface.jpeg
dxit -f myface.jpeg
dxit -f myface.jpeg -s "Cool Subdomain"
```

## Options

```
Usage:
  dxit [OPTIONS] [ARGS]

Options: 
  -f, --file FILE        File to share
  -d, --directory DIR    Directory to share
  -p, --port [NUMBER]    Network port to use (Default is 3000)
  -s, --subdomain STRING Subdomain for your link
  -v, --version          dxit version number
  -q, --quota [NUMBER]   Max number of downloads (Default is -1)
  -t, --token            Require token
  -h, --help             Display help and usage details
```

## Install

```
npm install -g dxit
```

## Run via NPX

```
npx dxit -d ./mystuff
```

## Get Help

```
dxit -h
```
