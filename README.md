
# IQUIDUS-OTC

An IRC bot that assists with the trade of crypto currencies before they are listed on exchanges.

## Requires

*  node
*  mongodb

## Clone the Source

    git clone https://github.com/iquidus/OTC iquidus-otc

## Install

    cd iquidus-otc
    npm install

## Configure

Copy settings.json.template to settings.json then edit settings.json.

## Run

	node otc.js

## User Commands

!hello : register your nick with the bot
!bid ORDER : place bid (format AMOUNT_OF_COINS@PRICE_EACH e.g 100K@30)
!ask ORDER : place ask (format AMOUNT_OF_COINS@PRICE_EACH e.g 100K@30)
!unbid : remove active bid
!unask : remove active ask
!bids : fetch all bids
!asks : fetch all asks
!spread : display spread.
!setbtc ADDRESS : set your btc address
!set[altcoin] ADDRESS : set your [altcoin] address
!getbtc NICK : display a users btc address
!get[altcoin] NICK : display a users [altcoin] address
!admins : display bot administrators
!escrows : display approved escrows
!help : fetch this help message.
!info : display bot information

## Admin Commands

!hello : changes your status to online
!bye : changes your status to offline
!rmbid USER : remove users active bid
!rmask USER : remove users active ask
!addadmin USER : make user a bot adimnistrator
!rmadmin USER : remove admin status from user
!addescrow USER : add user to approved escrows
!rmescrow USER : remove user from approved escrows

## Donate

BTC: 14EWdpqFx75N3F9EwtYdnbQnHTPFEUmWZt
LTC: LfDxv8K9Nz63ifibVhXXZs3iKgbUsYQXBS
MEC: MVPt7YHFYPLKZptgNDizEnS74CCF973e1w
EAC: eg1R4KzqeAaV6YkAebsHSxwVRYDhK9HXQi
GLB: 1JYf2ecLY3mTgydjS2CBzhHU2HgB7G9GzM
DGB: DPBV8siqomQ9icuAJ2ev2mgs8ZbKDmP8x8
KOI: 5e6RXK5jYWUNNChfhiLsdhJv6AgdokmpZX (coye)


