module.exports= {
    project:{
        ios:{},
        android:{},
    },
    assets: ['./src/assets/fonts/'],
    getTransferModulePath(){
        return require.resolve('react-native-typescript-transformer');
    },
    getSourceExits(){
        return ['ts','tsx']
    }
} ;