package OpenDataAccess.LambdaInterface;

public interface IFunction2<T,S,N> {
    public N Invoke(T t, S s);
}
