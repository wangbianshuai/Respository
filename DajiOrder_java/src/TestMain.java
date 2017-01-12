import Entity.Data.UserTable;
import MySql.DataBase;

import java.sql.*;
import java.util.List;
import java.util.Map;
import Data.User;
/**
 * Created by BianzhaiWang on 2017/1/11.
 */
public class TestMain {

    public  static  void main(String[] args) {

        try {
            User _user = new User();
            _user.DBAccess.SetConnectionString("jdbc:mysql://localhost/sys?user=root&password=123456");
            UserTable userTable = _user.GetLoginUser("admin", "admin");
            if(userTable!=null){
                System.out.println(userTable.LoginName);
            }
        }
        catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }


    public void ConnectionSql() throws SQLException {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection("jdbc:mysql://localhost/sys?user=root&password=123456");

            SelectSql(conn);

            // Do something with the Connection

        } catch (SQLException ex) {
            // handle any errors
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
        }
    }

    public void  SelectSql( Connection conn ) {
        Statement stmt = null;
        ResultSet rs = null;

        try {
            stmt = conn.createStatement();
            //rs = stmt.executeQuery();

            PreparedStatement sql = conn.prepareStatement("SELECT * FROM t_d_User WHERE LoginName=? and LoginPassword=?");
            sql.setString(1,"''%%///;select * form t_d_User;admin");
            sql.setString(2,"admin");

            rs= sql.executeQuery();


            // or alternatively, if you don't know ahead of time that
            // the query will be a SELECT...

            //if (stmt.execute("SELECT * FROM t_d_User")) {
            //rs = stmt.getResultSet();
            // }

            while (rs.next()) {
                String uid = rs.getString(1);
                String ufname = rs.getString(2);
                String ulname = rs.getString(3);
                String udate = rs.getString(4);
                System.out.println(uid + "\t" + ufname + "\t" + ulname + "\t" + udate );
            }//显示数据

            // Now do something with the ResultSet ....
        } catch (SQLException ex) {
            // handle any errors
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
        } finally {
            // it is a good idea to release
            // resources in a finally{} block
            // in reverse-order of their creation
            // if they are no-longer needed

            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException sqlEx) {
                } // ignore

                rs = null;
            }

            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException sqlEx) {
                } // ignore

                stmt = null;
            }
        }
    }
}
