
import { CreateUserDto } from 'src/register/dto/create-user.dto';
import { dbFS } from '../../main';
import dotenv from 'dotenv';
import bCrypt from 'bCrypt';

dotenv.config({
    path: './.env'
})
export class UserContainer {

    user = []; // Persistencia Local.
    collection: string = process.env.DB_USERS_COLLECTION;
    query = dbFS.collection(this.collection);

    async disconnect(){
        try{
            // await admin.app().delete();
            process.exit[0];
            console.log(`El servidor ${process.pid} se ha desconectado exitosamente de Firebase.`)
            // logger.info(`El servidor ${process.pid} se ha desconectado exitosamente de Firebase.`)
        }catch(error){
            // logger.error(`Se ha presentado error al intentar desconectar el servidor ${process.pid} de Firebase: ${error}`)
            console.log(`Se ha presentado error al intentar desconectar el servidor ${process.pid} de Firebase: ${error}`)
        }
    }

    // async saveUser(newUser: CreateUserDto){
    //     try {
    //         newUser.password = bCrypt.hashSync(newUser.password, bCrypt.genSaltSync(10), null)
    //         let data = await this.query.add({...newUser});
    //         console.log('GuardadoFirebase: ', data.id);
    //         return data.id;
    //       } catch (error) {
    //         console.log("Se ha presentado error ", error);
    //       } finally {
    //         this.disconnect();
    //       }
    // }
    async loginUser(user){

        let username = user.username;
        let pwd = user.password;

        let registeredUser = await this.getUserByName(username);
        if(!registeredUser){
            return {error: "Usuario no registrado"}
        }else if (!bCrypt.compareSync(pwd, registeredUser.password)){
            return {error: "Contraseña incorrecta"}
        }else {
            return {user: registeredUser.username, status: 'Granted'}
        }

    }
    async getUsers(){
        try{
            let data = await this.query.get();
            let docs = data.docs.map((doc) => {
                let id = doc.id;
                let element = doc.data();
                element.id = id
                return element;
            })
            console.log('Mensajes extraidos de Firebase ', docs);
            return docs;
        } catch (error) {
            console.log("Se ha presentado error al consultar mensajes ", error);
        } finally {
            this.disconnect();
        }
    }

    async getUserByName(username: string) {
        try {
          
            let data = await this.query.where('username','==', username).get();
            // console.log('Empty: ',data.empty);
            if (data.empty){
                return null ;
            }else{
                let usuario = null;
                data.forEach((doc) => {
                    usuario = doc.data();
                    // console.log(doc.id + ' => ' + JSON.stringify(doc.data()));
                })
                // console.log('Usuario :', usuario);
                return usuario;
            }
        } catch (error) {
            console.log("Se ha presentado error ", error);
        } finally{
            this.disconnect();
        }
      }

}