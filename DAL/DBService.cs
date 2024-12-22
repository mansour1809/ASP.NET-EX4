using HW1.BL;
using System.Data;
using System.Data.SqlClient;

namespace HW1.DAL
{
    public class DBService
    {
        public DBService()
        {

        }
        public SqlConnection connect(String conString)
        {

            // read the connection string from the configuration file
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString(conString);
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        private SqlCommand CreateCommandWithStoredProcedureGeneral(String spName, SqlConnection con, Dictionary<string, object> paramDic)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            if (paramDic != null)
                foreach (KeyValuePair<string, object> param in paramDic)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);

                }


            return cmd;
        }

        private Cast MapCast(SqlDataReader dataReader)
        {
            Cast c = new Cast();
            c.Id = (dataReader["Id"]).ToString();
            c.Name = dataReader["Name"].ToString();
            c.Role = dataReader["Role"].ToString();
            c.DateOfBirth = Convert.ToDateTime(dataReader["DateOfBirth"]);
            c.Country = dataReader["country"].ToString();
            c.PhotoUrl = dataReader["PhotoUrl"].ToString();
            return c;

        }
        private Movie MapMovie(SqlDataReader dataReader)
        {
            Movie m = new Movie();
            m.Id = Convert.ToInt32(dataReader["Id"].ToString());
            m.Title = dataReader["Title"].ToString();
            m.Rating = Convert.ToDouble(dataReader["Rating"].ToString());
            m.Income = Convert.ToInt32(dataReader["Income"].ToString());
            m.ReleaseYear = Convert.ToInt32(dataReader["ReleaseYear"]);
            m.Duration = Convert.ToInt32(dataReader["Duration"]);
            m.Language = dataReader["Language"].ToString();
            m.Description = dataReader["Description"].ToString();
            m.Genre = dataReader["Genre"].ToString();
            m.PhotoUrl = dataReader["PhotoUrl"].ToString();
            return m;
        }
        public bool InsertMovie(Movie m)// 
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            // paramDic.Add("@id", m.Id);
            paramDic.Add("@Title", m.Title);
            paramDic.Add("@Rating", m.Rating);
            paramDic.Add("@Income", m.Income);
            paramDic.Add("@ReleaseYear", m.ReleaseYear);
            paramDic.Add("@Duration", m.Duration);
            paramDic.Add("@Language", m.Language);
            paramDic.Add("@Description", m.Description);
            paramDic.Add("@Genre", m.Genre);
            paramDic.Add("@PhotoUrl", m.PhotoUrl);


            cmd = CreateCommandWithStoredProcedureGeneral("sp_InsertMovies", con, paramDic); // create the command

            try
            {
                cmd.ExecuteNonQuery();
                return true;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        //public List<Movie> ReadMovies(string sp)
        //{
        //    SqlConnection con;
        //    SqlCommand cmd;
        //    try
        //    {
        //        con = connect("myProjDB"); // create the connection
        //    }
        //    catch (Exception ex)
        //    {
        //        throw (ex);
        //    }

        //    cmd = CreateCommandWithStoredProcedureGeneral(sp, con, null);

        //    try
        //    {

        //        SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

        //        List<Movie> movies = new List<Movie>();

        //        while (dataReader.Read())
        //        {
        //            movies.Add(MapMovie(dataReader));
        //        }
        //        return movies;

        //    }
        //    catch (Exception ex)
        //    {
        //        throw (ex);
        //    }
        //    finally
        //    {
        //        if (con != null)
        //        {
        //            // close the db connection
        //            con.Close();
        //        }
        //    }

        //}



        public List<object> ReadMoviesWithCasts(string spMovies, string spCasts)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                throw ex;
            }

            cmd = CreateCommandWithStoredProcedureGeneral(spMovies, con, null);

            try
            {
                // Read movies
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                List<object> movieWithCastsList = new List<object>(); //HOC

                while (dataReader.Read())
                {
                    Movie movie = MapMovie(dataReader);

                    List<Cast> casts = ReadCastsForMovie(movie.Id, spCasts); // cast for spesific movie

                    movieWithCastsList.Add(new { Movie = movie, Casts = casts });
                }

                return movieWithCastsList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close(); // Close the database connection
                }
            }
        }




        // Helper method to read the cast for a specific movie

        private List<Cast> ReadCastsForMovie(int movieId, string spCasts)
        {

            SqlConnection con;
            SqlCommand cmd;


            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                throw ex;
            }
            Dictionary<string, object> paramDic = new Dictionary<string, object> {
                        { "@movieId", movieId }
                    };
            cmd = CreateCommandWithStoredProcedureGeneral(spCasts, con, paramDic);

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<Cast> casts = new List<Cast>();

                while (dataReader.Read())
                {
                    casts.Add(MapCast(dataReader)); // Map each cast member
                }

                return casts;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close(); // Close the database connection
                }
            }
        }


        public List<Movie> ReadWishlist(string sp, int userId)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            Dictionary<string, object> paramDic = new Dictionary<string, object> {
                        { "@UserId", userId }
                    };

            cmd = CreateCommandWithStoredProcedureGeneral(sp, con, paramDic); // create the command

            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<Movie> wishlist = new List<Movie>();

                while (dataReader.Read())
                {
                    wishlist.Add(MapMovie(dataReader));

                }
                return wishlist;

            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }

        public List<Movie> ReadByRating(int userId, double rating)
        {
            List<Movie> movies = new List<Movie>();
            SqlConnection con = null; // Declare outside the try block

            try
            {
                con = connect("myProjDB"); // Assign connection here
                Dictionary<string, object> paramDic = new Dictionary<string, object> {
            { "@Rating", rating },
            { "@UserId", userId }
        };

                using (SqlCommand cmd = CreateCommandWithStoredProcedureGeneral("sp_filterByRate", con, paramDic))
                {
                    using (SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                    {
                        while (dataReader.Read())
                        {
                            movies.Add(MapMovie(dataReader));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while fetching movies by rating.", ex);
            }
            finally
            {
                if (con != null && con.State != ConnectionState.Closed)
                {
                    con.Close(); // Close the connection in finally
                }
            }
            return movies;
        }


        public List<Movie> ReadByDuration(int userId, int duration)
        {
            List<Movie> movies = new List<Movie>();
            SqlConnection con = null; // Declare outside the try block

            try
            {
                con = connect("myProjDB"); // Initialize connection
                Dictionary<string, object> paramDic = new Dictionary<string, object> {
            { "@Duration", duration },
            { "@UserId", userId }
        };

                using (SqlCommand cmd = CreateCommandWithStoredProcedureGeneral("sp_filterByDuration", con, paramDic))
                {
                    using (SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                    {
                        while (dataReader.Read())
                        {
                            movies.Add(MapMovie(dataReader));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while fetching movies by duration.", ex);
            }
            finally
            {
                if (con != null && con.State != ConnectionState.Closed)
                {
                    con.Close(); // Close the connection in finally
                }
            }
            return movies;
        }


        public bool InsertCast(Cast c)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            // paramDic.Add("@Id", c.Id);
            paramDic.Add("@Name", c.Name);
            paramDic.Add("@Role", c.Role);
            paramDic.Add("@DateOfBirth", c.DateOfBirth);
            paramDic.Add("@country", c.Country);
            paramDic.Add("@PhotoUrl", c.PhotoUrl);

            cmd = CreateCommandWithStoredProcedureGeneral("sp_InsertCast", con, paramDic); // create the command

            try
            {
                cmd.ExecuteNonQuery();
                return true;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public List<Cast> ReadCasts()
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }


            cmd = CreateCommandWithStoredProcedureGeneral("sp_ReturnCast", con, null); // create the command

            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<Cast> casts = new List<Cast>();
                while (dataReader.Read())
                {
                    casts.Add(MapCast(dataReader));
                }
                return casts;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }


        public bool InsertUser(WebUser u)// 
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            // paramDic.Add("@id", u.Id);
            paramDic.Add("@UserName", u.UserName);
            paramDic.Add("@Email", u.Email);
            paramDic.Add("@Password", u.Password);


            cmd = CreateCommandWithStoredProcedureGeneral("sp_InsertUser", con, paramDic); // create the command

            try
            {
                cmd.ExecuteNonQuery();
                return true;
            }
            catch (SqlException ex)
            {
                if (ex.Number == 50001) // Custom error code for "Username already exists"
                {
                    return false;
                }
                // write to log
                throw (ex);

            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public int ReadUser(string userName, string password)
        {
            //if (userName == null || password == null)
            //    return false;
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@UserName", userName);
            paramDic.Add("@Password", password);

            cmd = CreateCommandWithStoredProcedureGeneral("sp_ReadUser", con, paramDic); // create the command

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                return dataReader.Read() ? Convert.ToInt32(dataReader["ID"].ToString()) : -1;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }


        public bool InsertToWishList(int userId, int movieId)// 
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            // paramDic.Add("@id", u.Id);
            paramDic.Add("@UserId", userId);
            paramDic.Add("@MovieId", movieId);


            cmd = CreateCommandWithStoredProcedureGeneral("sp_AddToWishList", con, paramDic); // create the command

            try
            {
                cmd.ExecuteNonQuery();
                return true;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);

            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }


        public Cast InsertCastToMovie(int movieId, string castId)// 
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            // paramDic.Add("@id", u.Id);
            paramDic.Add("@castId", castId);
            paramDic.Add("@MovieId", movieId);


            cmd = CreateCommandWithStoredProcedureGeneral("sp_insertCastToMovie", con, paramDic); // create the command

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                Cast c = new Cast();
                if (dataReader.Read())
                    c = MapCast(dataReader);
                return c;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);

            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }



        public bool DeleteFromWishList(int userId, int movieId)// 
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@UserId", userId);
            paramDic.Add("@MovieId", movieId);


            cmd = CreateCommandWithStoredProcedureGeneral("sp_deleteFromWishlist", con, paramDic); // create the command

            try
            {
                cmd.ExecuteNonQuery();
                return true;
            }
            catch (Exception ex)
            {
                // write to log
                return false;
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }



        public List<WebUser> GetAllUsers()
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }


            cmd = CreateCommandWithStoredProcedureGeneral("sp_ReturnUsers", con, null); // create the command

            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<WebUser> users = new List<WebUser>();

                while (dataReader.Read())
                {
                    WebUser u = new WebUser();
                    u.Id =Convert.ToInt32(dataReader["ID"].ToString());
                    u.UserName = dataReader["UserName"].ToString();
                    u.Email = dataReader["Email"].ToString();
                    u.Password= dataReader["Password"].ToString();
                    users.Add(u);
                }
                return users;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }

    }
}















