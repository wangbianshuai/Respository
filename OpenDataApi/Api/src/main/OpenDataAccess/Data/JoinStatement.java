package OpenDataAccess.Data;

public class JoinStatement {
    public String JoinType;
    public String JoinTable;
    public String RelationOn;

    public JoinStatement(String joinType, String joinTable, String relationOn) {
        JoinType = joinType;
        JoinTable = joinTable;
        RelationOn = relationOn;
    }
}