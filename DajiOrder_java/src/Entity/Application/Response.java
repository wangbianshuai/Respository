package Entity.Application;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public class Response  implements  IResponse {

    public Ack Ack = null;

    public Response() {
        Ack = new Ack();
    }
}
