CREATE DATABASE IF NOT EXISTS project;
USE project;

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickName VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    birthdate DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    role ENUM('administrator', 'client') DEFAULT 'client',
    password VARCHAR(255) NOT NULL,
    description TEXT,
    avatar VARCHAR(255),
    blocked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  movie_title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_entry (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS follows (
  follower_id INT NOT NULL,
  followed_id INT NOT NULL,
  PRIMARY KEY (follower_id, followed_id),
  FOREIGN KEY (follower_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (followed_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS favorite_movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_movie (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  movie_title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(500),
  comentario TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  movie_title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(500),
  puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS movies_viewed (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  movie_title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(500),
  comment_id INT DEFAULT NULL,
  puntuacion_id INT DEFAULT NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (puntuacion_id) REFERENCES scores(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `user` VALUES (11,'Leo','Leo','1998-07-15','leo@gmail.com','administrator','$2b$10$NOUeGOGQSOwmesSXdbeoSO0B7SkvxL6WVEPoxBY7zJOXbIqDUCsEK','Hola, me encanta el cine. Me llamo Ralph.','https://api.dicebear.com/7.x/bottts/png?seed=Sawyer',0,'2025-06-12 23:24:35'),(12,'LilVaro','Alvaro','1992-07-12','alvaro@gmail.com','client','$2b$10$qpzx0bW64je.FTxofDJLEeUHjC2gpO37OWZJlWiSM16qo5SXyNwUm','Soy un apasionado fuerte fuerte de las pel├¡culas. Encantado.','https://api.dicebear.com/7.x/bottts/png?seed=monster',0,'2025-06-12 23:25:33'),(14,'Jeims','Jaime','1995-07-15','jaime@gmail.com','client','$2b$10$gAP5i.G/SfcaY9mFHS6o4uPfozwceuKX.L6HY3Q41nodp0dy8kUna','Cin├®filo total.','https://api.dicebear.com/7.x/bottts/png?seed=14',0,'2025-06-12 23:26:24'),(15,'Marti','Martina','2002-07-15','martina@gmail.com','client','$2b$10$7nI8Ukv.a0ZIRQRTdrkheO6KUBcBVWPkLo9n2OY4WzNlLozMhWWEa','Me encantan las pel├¡culas. ','https://api.dicebear.com/7.x/bottts/png?seed=cat',0,'2025-06-12 23:27:07'),(16,'Glosito','Glosito','2000-03-12','glosito@gmail.com','client','$2b$10$MBBa8IZ8MRcBgFXMxXmd4OrQOczjscNCcdcaPhW0FJgedmdTyrGaC','','https://api.dicebear.com/7.x/bottts/png?seed=Sawyer',0,'2025-06-12 23:27:47'),(19,'Kanacienta','Juliana','1988-11-09','julianalisseth@gmail.com','client','$2b$10$PPa8KKeq72dZeSJdpH2SWO/.uY1Zu1568eJWRScdTYR3L1nKPjPyO','A morir en la butaca o en el sof├í','https://api.dicebear.com/7.x/bottts/png?seed=robot',0,'2025-06-13 09:32:44'),(20,'Jorge','Jorge','1998-07-15','jorge@gmail.com','client','$2b$10$/zxbJWN6ZMKT2IOA12In0.nKMVkbZ0rXU4/O5C8494AAiKhJbU6re','Hola mundo.','https://api.dicebear.com/7.x/bottts/png?seed=20',0,'2025-06-13 10:51:51');
INSERT INTO `comments` VALUES (6,11,1239193,'Deep Cover','/euM8fJvfH28xhjGy25LiygxfkWc.jpg','No me ha gustado, pero nada.','2025-06-12 23:32:43'),(7,11,13804,'Fast & Furious','/lUtVoRukW7WNtUySwd8hWlByBds.jpg','Maravillosa. Espectacular. No s├® ni cu├íl es jefe.','2025-06-12 23:35:42'),(8,11,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg','Buena peli pero me dorm├¡ los ├║ltimos 150mins.','2025-06-12 23:37:22'),(9,11,552524,'Lilo & Stitch','/7c5VBuCbjZOk7lSfj9sMpmDIaKX.jpg','No me ha quedado claro qui├®n es Lilo y qui├®n es Stitch.','2025-06-12 23:38:25'),(10,11,757725,'Shadow Force','/7IEW24vBiZerZrDlgLVSUU3oT1C.jpg','Pelicul├│n, aunque para aviones me ha gustado mas la de Planes(Pixar).','2025-06-12 23:39:18'),(11,12,1376434,'Predator: Killer of Killers','/lbimIPTVsSlnmqSW5ngEsUxtHLM.jpg','Lo mejor de lo mejor han sido los cr├®ditos.','2025-06-12 23:50:35'),(12,12,1087192,'How to Train Your Dragon','/q5pXRYTycaeW6dEgsCrd4mYPmxM.jpg','Un treh porque el drag├│n era demasiado adorable. Mucho texto y pocos dragones.','2025-06-12 23:51:29'),(13,12,155,'The Dark Knight','/qJ2tW6WMUDux911r6m7haRef0WH.jpg','Batman es Batman. Absolute cinema.','2025-06-12 23:52:14'),(14,12,1239193,'Deep Cover','/euM8fJvfH28xhjGy25LiygxfkWc.jpg','Una peli encantadora, no me la he visto pero me lo imagino.','2025-06-12 23:54:30'),(15,15,1239193,'Deep Cover','/euM8fJvfH28xhjGy25LiygxfkWc.jpg','La pel├¡cula m├ís random del mundo ehhh.','2025-06-12 23:59:35'),(16,15,1087891,'The Amateur','/SNEoUInCa5fAgwuEBMIMBGvkkh.jpg','Las he visto mejores. No la recomiendo.','2025-06-13 00:00:06'),(17,15,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg','No es para tanto ese se├▒or, es muy pesado. ┬í┬í┬íEST├ü MUERTO!!!┬┐Lo sab├¡as? Dato curioso. Pobre se├▒or.','2025-06-13 00:01:49'),(18,16,1061474,'Superman','/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg','La estoy esperando con muchas ganas. ','2025-06-13 00:12:56'),(19,11,389,'12 Angry Men','/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg','Me ha encantado.','2025-06-13 09:13:38'),(20,19,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg','De lo mejor en el mundo cinematrogr├ífico. Marlon Brandon est├í que se sale. Amo la peli','2025-06-13 09:34:43'),(21,19,634492,'Madame Web','/rULWuutDcN5NvtiZi4FRPzRYWSh.jpg','Uno se queda corto, mal├¡sima no, lo siguiente','2025-06-13 09:36:30'),(22,19,6023,'P.S. I Love You','/x6M9nlTpgpI4AOw0tMkOAVbhL5z.jpg','Am├® la historia, triste y divertida a la vez','2025-06-13 09:37:30'),(23,19,77,'Memento','/fKTPH2WvH8nHTXeBYBVhawtRqtR.jpg','Muy buena!!!','2025-06-13 09:42:31'),(24,20,385687,'Fast X','/fiVW06jE7z9YnO4trhaMEdclSiC.jpg','No me gusta','2025-06-13 10:57:18');
INSERT INTO `favorite_movies` VALUES (5,11,920,'Cars','/2Touk3m5gzsqr1VsvxypdyHY5ci.jpg','2025-06-12 23:31:24'),(6,11,49013,'Cars 2','/okIz1HyxeVOMzYwwHUjH2pHi74I.jpg','2025-06-12 23:31:31'),(7,11,260514,'Cars 3','/fyy1nDC8wm553FCiBDojkJmKLCs.jpg','2025-06-12 23:31:37'),(8,11,151960,'Planes','/i2xgU0y0p77WTrB0oIkbpdaWq8R.jpg','2025-06-12 23:31:45'),(9,11,1075794,'Leo','/gSOVog7ydsaF1YpgAqBqnKYFGY.jpg','2025-06-12 23:31:50'),(11,12,13179,'Tinker Bell','/3Ma0r1n8kfH7UaQMS7bJ9KsYUjT.jpg','2025-06-12 23:45:34'),(13,12,9479,'The Nightmare Before Christmas','/oQffRNjK8e19rF7xVYEN8ew0j7b.jpg','2025-06-12 23:45:58'),(14,12,2062,'Ratatouille','/t3vaWRPSf6WjDSamIkKDs1iQWna.jpg','2025-06-12 23:46:09'),(15,12,267446,'Hello Kitty and Friends: Kitty Princess for a Night','/qeNxJoGcEigVCXa1P5ECWLVYz4w.jpg','2025-06-12 23:46:39'),(16,15,1197306,'A Working Man','/6FRFIogh3zFnVWn7Z6zcYnIbRcX.jpg','2025-06-12 23:56:29'),(17,15,836225,'The Exorcism of God','/hangTmbxpSV4gpHG7MgSlCWSSFa.jpg','2025-06-12 23:56:43'),(18,15,218,'The Terminator','/hzXSE66v6KthZ8nPoLZmsi2G05j.jpg','2025-06-12 23:56:52'),(19,15,1374,'Rocky IV','/2MHUit4H6OK5adcOjnCN6suCKOl.jpg','2025-06-12 23:57:02'),(20,15,1366,'Rocky','/8kEun6U9hTddM7NEfLLCGQKU2Mp.jpg','2025-06-12 23:57:08'),(21,14,346698,'Barbie','/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg','2025-06-13 00:04:07'),(22,14,73456,'Barbie: Princess Charm School','/lI2jPbssax6XX5vDqB9mTJHGzfH.jpg','2025-06-13 00:04:14'),(23,14,13002,'Barbie in the 12 Dancing Princesses','/yBB7PwXRFJ29U8m8SnTcWVizFvM.jpg','2025-06-13 00:04:20'),(24,14,15016,'Barbie of Swan Lake','/sLpCLVQWTU7BI4yAL6kIFM9J3eX.jpg','2025-06-13 00:04:30'),(25,14,373872,'Dora the Explorer: Catch the Stars','/yHYnPgPUnu5RrkBUTjh7tMV1EqY.jpg','2025-06-13 00:04:43'),(26,16,1032823,'Trap','/jwoaKYVqPgYemFpaANL941EF94R.jpg','2025-06-13 00:10:20'),(27,16,277216,'Straight Outta Compton','/1CiLJx8Xtv3TbbFj6k7BboSmKgC.jpg','2025-06-13 00:11:02'),(28,16,20093,'Straight from the Barrio','/5LIlCFEQnlCWpsd1HYmvhY5JHpq.jpg','2025-06-13 00:11:11'),(29,16,35,'The Simpsons Movie','/gzb6P78zeFTnv9eoFYnaJ2YrZ5q.jpg','2025-06-13 00:11:32'),(30,16,1098343,'The Gangster, the Cop, the Devil','/tVQ1DJjdtPQd9HeaUntXaGuWadq.jpg','2025-06-13 00:11:57'),(31,19,1271,'300','/h7Lcio0c9ohxPhSZg42eTlKIVVY.jpg','2025-06-13 09:39:14'),(32,19,2841,'A Very Long Engagement','/t73m7lX0eFYDjlB1Gcb7r3S5Yt.jpg','2025-06-13 09:40:03'),(33,19,27205,'Inception','/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg','2025-06-13 09:40:20'),(34,19,194,'Am├®lie','/oTKduWL2tpIKEmkAqF4mFEAWAsv.jpg','2025-06-13 09:40:33'),(35,19,4935,'Howl\'s Moving Castle','/23hUJh7JdO23SpgUB5oiFDQk2wX.jpg','2025-06-13 09:40:44'),(36,12,114051,'Navajeros','/dkmgJgkQ3ojaSpnlFUwND1JJ3Fx.jpg','2025-06-13 09:47:37'),(37,20,671,'Harry Potter and the Philosopher\'s Stone','/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg','2025-06-13 10:53:50');
INSERT INTO `follows` VALUES (12,11),(14,11),(15,11),(19,11),(11,12),(14,12),(19,12),(11,14),(12,14),(15,14),(19,14),(11,15),(12,15),(14,15),(19,15),(20,15),(11,16),(12,16),(14,16);
INSERT INTO `movies_viewed` VALUES (6,11,1239193,'Deep Cover','/euM8fJvfH28xhjGy25LiygxfkWc.jpg',6,6,'2025-06-12 23:32:48'),(7,11,13804,'Fast & Furious','/lUtVoRukW7WNtUySwd8hWlByBds.jpg',7,7,'2025-06-12 23:35:43'),(8,11,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',8,8,'2025-06-12 23:37:23'),(9,11,552524,'Lilo & Stitch','/7c5VBuCbjZOk7lSfj9sMpmDIaKX.jpg',9,9,'2025-06-12 23:38:26'),(10,11,757725,'Shadow Force','/7IEW24vBiZerZrDlgLVSUU3oT1C.jpg',10,10,'2025-06-12 23:39:18'),(11,12,1376434,'Predator: Killer of Killers','/lbimIPTVsSlnmqSW5ngEsUxtHLM.jpg',11,11,'2025-06-12 23:50:36'),(12,12,1087192,'How to Train Your Dragon','/q5pXRYTycaeW6dEgsCrd4mYPmxM.jpg',12,12,'2025-06-12 23:51:30'),(13,12,155,'The Dark Knight','/qJ2tW6WMUDux911r6m7haRef0WH.jpg',13,13,'2025-06-12 23:52:15'),(14,12,1239193,'Deep Cover','/euM8fJvfH28xhjGy25LiygxfkWc.jpg',14,14,'2025-06-12 23:54:31'),(15,15,1239193,'Deep Cover','/euM8fJvfH28xhjGy25LiygxfkWc.jpg',15,15,'2025-06-12 23:59:36'),(16,15,1087891,'The Amateur','/SNEoUInCa5fAgwuEBMIMBGvkkh.jpg',16,16,'2025-06-13 00:00:07'),(17,15,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',17,17,'2025-06-13 00:01:50'),(18,15,1376434,'Predator: Killer of Killers','/lbimIPTVsSlnmqSW5ngEsUxtHLM.jpg',NULL,18,'2025-06-13 00:02:34'),(19,14,541671,'Ballerina','/mKp4euM5Cv3m2U1Vmby3OGwcD5y.jpg',NULL,19,'2025-06-13 00:08:30'),(20,14,389,'12 Angry Men','/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',NULL,20,'2025-06-13 00:08:41'),(21,14,870028,'The Accountant┬▓','/kMDUS7VmFhb2coRfVBoGLR8ADBt.jpg',NULL,21,'2025-06-13 00:08:53'),(22,16,1061474,'Superman','/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg',18,22,'2025-06-13 00:12:57'),(23,11,389,'12 Angry Men','/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',19,23,'2025-06-13 09:13:42'),(24,19,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',20,24,'2025-06-13 09:34:46'),(25,19,634492,'Madame Web','/rULWuutDcN5NvtiZi4FRPzRYWSh.jpg',21,25,'2025-06-13 09:36:30'),(26,19,6023,'P.S. I Love You','/x6M9nlTpgpI4AOw0tMkOAVbhL5z.jpg',22,26,'2025-06-13 09:37:31'),(27,19,77,'Memento','/fKTPH2WvH8nHTXeBYBVhawtRqtR.jpg',23,27,'2025-06-13 09:42:32'),(28,20,385687,'Fast X','/fiVW06jE7z9YnO4trhaMEdclSiC.jpg',24,28,'2025-06-13 10:57:18');
INSERT INTO `scores` VALUES (6,11,1239193,'Deep Cover','/euM8fJvfH28xhjGy25LiygxfkWc.jpg',5,'2025-06-12 23:32:46'),(7,11,13804,'Fast & Furious','/lUtVoRukW7WNtUySwd8hWlByBds.jpg',9,'2025-06-12 23:35:43'),(8,11,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',9,'2025-06-12 23:37:22'),(9,11,552524,'Lilo & Stitch','/7c5VBuCbjZOk7lSfj9sMpmDIaKX.jpg',8,'2025-06-12 23:38:26'),(10,11,757725,'Shadow Force','/7IEW24vBiZerZrDlgLVSUU3oT1C.jpg',6,'2025-06-12 23:39:18'),(11,12,1376434,'Predator: Killer of Killers','/lbimIPTVsSlnmqSW5ngEsUxtHLM.jpg',10,'2025-06-12 23:50:35'),(12,12,1087192,'How to Train Your Dragon','/q5pXRYTycaeW6dEgsCrd4mYPmxM.jpg',3,'2025-06-12 23:51:30'),(13,12,155,'The Dark Knight','/qJ2tW6WMUDux911r6m7haRef0WH.jpg',10,'2025-06-12 23:52:14'),(14,12,1239193,'Deep Cover','/euM8fJvfH28xhjGy25LiygxfkWc.jpg',10,'2025-06-12 23:54:31'),(15,15,1239193,'Deep Cover','/euM8fJvfH28xhjGy25LiygxfkWc.jpg',10,'2025-06-12 23:59:36'),(16,15,1087891,'The Amateur','/SNEoUInCa5fAgwuEBMIMBGvkkh.jpg',5,'2025-06-13 00:00:07'),(17,15,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',6,'2025-06-13 00:01:49'),(18,15,1376434,'Predator: Killer of Killers','/lbimIPTVsSlnmqSW5ngEsUxtHLM.jpg',5,'2025-06-13 00:02:34'),(19,14,541671,'Ballerina','/mKp4euM5Cv3m2U1Vmby3OGwcD5y.jpg',5,'2025-06-13 00:08:30'),(20,14,389,'12 Angry Men','/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',8,'2025-06-13 00:08:41'),(21,14,870028,'The Accountant┬▓','/kMDUS7VmFhb2coRfVBoGLR8ADBt.jpg',9,'2025-06-13 00:08:53'),(22,16,1061474,'Superman','/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg',10,'2025-06-13 00:12:56'),(23,11,389,'12 Angry Men','/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',5,'2025-06-13 09:13:40'),(24,19,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',10,'2025-06-13 09:34:45'),(25,19,634492,'Madame Web','/rULWuutDcN5NvtiZi4FRPzRYWSh.jpg',1,'2025-06-13 09:36:30'),(26,19,6023,'P.S. I Love You','/x6M9nlTpgpI4AOw0tMkOAVbhL5z.jpg',8,'2025-06-13 09:37:30'),(27,19,77,'Memento','/fKTPH2WvH8nHTXeBYBVhawtRqtR.jpg',8,'2025-06-13 09:42:32'),(28,20,385687,'Fast X','/fiVW06jE7z9YnO4trhaMEdclSiC.jpg',2,'2025-06-13 10:57:18');
INSERT INTO `watchlist` VALUES (7,11,1239193,'Deep Cover','/euM8fJvfH28xhjGy25LiygxfkWc.jpg','2025-06-12 23:32:26'),(8,11,1087891,'The Amateur','/SNEoUInCa5fAgwuEBMIMBGvkkh.jpg','2025-06-12 23:33:11'),(9,11,384018,'Fast & Furious Presents: Hobbs & Shaw','/qRyy2UmjC5ur9bDi3kpNNRCc5nc.jpg','2025-06-12 23:33:50'),(10,11,168259,'Furious 7','/wurKlC3VKUgcfsn0K51MJYEleS2.jpg','2025-06-12 23:34:14'),(11,11,13804,'Fast & Furious','/lUtVoRukW7WNtUySwd8hWlByBds.jpg','2025-06-12 23:34:41'),(12,11,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg','2025-06-12 23:37:27'),(13,12,9479,'The Nightmare Before Christmas','/oQffRNjK8e19rF7xVYEN8ew0j7b.jpg','2025-06-12 23:47:09'),(14,12,552524,'Lilo & Stitch','/7c5VBuCbjZOk7lSfj9sMpmDIaKX.jpg','2025-06-12 23:48:35'),(15,12,757725,'Shadow Force','/7IEW24vBiZerZrDlgLVSUU3oT1C.jpg','2025-06-12 23:49:32'),(16,12,574475,'Final Destination Bloodlines','/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg','2025-06-12 23:52:46'),(17,12,1426776,'STRAW','/t3cmnXYtxJb9vVL1ThvT2CWSe1n.jpg','2025-06-12 23:52:51'),(18,12,870028,'The Accountant┬▓','/kMDUS7VmFhb2coRfVBoGLR8ADBt.jpg','2025-06-12 23:52:57'),(19,12,713364,'Clown in a Cornfield','/6ep6gw90TJ8bYvJC6hEDo8SxjoJ.jpg','2025-06-12 23:53:41'),(20,15,1239193,'Deep Cover','/euM8fJvfH28xhjGy25LiygxfkWc.jpg','2025-06-12 23:59:17'),(21,15,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg','2025-06-13 00:00:34'),(22,15,424,'Schindler\'s List','/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg','2025-06-13 00:03:05'),(23,14,1087192,'How to Train Your Dragon','/q5pXRYTycaeW6dEgsCrd4mYPmxM.jpg','2025-06-13 00:07:21'),(24,14,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg','2025-06-13 00:07:32'),(25,14,1376434,'Predator: Killer of Killers','/lbimIPTVsSlnmqSW5ngEsUxtHLM.jpg','2025-06-13 00:07:47'),(26,14,278,'The Shawshank Redemption','/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg','2025-06-13 00:07:58'),(27,14,574475,'Final Destination Bloodlines','/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg','2025-06-13 00:08:06'),(29,19,238,'The Godfather','/3bhkrj58Vtu7enYsRolD1fZdja1.jpg','2025-06-13 09:33:49'),(30,19,6023,'P.S. I Love You','/x6M9nlTpgpI4AOw0tMkOAVbhL5z.jpg','2025-06-13 09:37:04'),(31,20,385687,'Fast X','/fiVW06jE7z9YnO4trhaMEdclSiC.jpg','2025-06-13 10:56:57'),(32,11,1100988,'28 Years Later','/361hRZoG91Nw6qXaIKuGoogQjix.jpg','2025-06-27 09:41:38');
