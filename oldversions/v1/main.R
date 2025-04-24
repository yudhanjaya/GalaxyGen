
library(networkD3) #for Simplenetwork


#set up variables
log <- data.frame(id = 0, type = "", class = "", name = "", source = 0, target = 0, value = 0) #this will contain all our creations
object_count = as.integer(0)
log <- log[-c(1),,drop=F]
starlog <- log
planetlog <- log

#generator main functions

planetgenerator <- function() { 
  planet_class <- planetclassselector() #get a planet class
  planet_name <- namer() #get a name
  log_temp <- data.frame(id = "", type = "planet", class = planet_class, name = planet_name, source = 0, target = 0, value = 0)
  return(log_temp)
}

stargenerator <- function(){
  star_class <- starclassselector() #send the seed and get a planet class
  star_name <- namer()
  log_temp <- data.frame(id = "", type = "star", class = star_class, name = star_name, source = 0, target = 0, value = 0)
  return(log_temp)
}

#artefactgenerator <- function(artseed) {
  
#}

#generator sub functions

planetclassselector <- function() {
#simply picks and returns a planet type based on another normal distribution
  planetseed <- rnorm(1, mean = 2, sd = 1)
  if (planetseed >= 0 & planetseed < 2) {
    class <- "rocky"
  } else if (planetseed >= 2 & planetseed < 3) {
    class <- "gaseous"
  } else if (planetseed >= 3) {
    class <- "artifical construct"
  }
  return(class)
}

starclassselector <- function() {
#picks and returns a star type based on another normal distribution. 
  #types of stars from the Morgan-Keenan system.
  starseed <- rnorm(1, mean = 4, sd = 3)
  if (starseed >= 4 & starseed < 7) {
    class <- "class_M" #red giant/dwarf/flare. These are something like 70% of known stars. Incredibly common,
                       #so let's give it a wide range
  } else if (starseed >= 3 & starseed < 4) {
    class <- "class_K" #yellow-orange .Next most popular at 12$
  } else if (starseed >=2 & starseed < 3) {
    starlist <- c("class_A", "class_F", "class_G") #next most common stars, pick random
    class <- paste(sample(starlist, 1))
  } else {
    starlist <- c("class_O", "class_RW", "class_L", "class_T", "class_Y", "class_C", "class_D") #now the rarer stuff - blue stars, supernova remnants, weird brown dwarves.
    class <- paste(sample(starlist, 1))
  }
  return(class)
 }

namer <- function() {
  namelist <- as.list(read.csv("E://GalaxyGen//one syllable sounds.txt"))
  namelist <- as.data.frame(namelist) #hacky shit
  name = "unnamed"
  namecount = as.integer(rnorm(1, mean = 4, sd = 1))
  if (i > 0) {
  name = ""
  for (i in 1:namecount){
  name <- paste(name, as.character(sample(colnames(namelist),1))) #more hacky shit, I can't believe I'm using column headers 
  #as a data store
  name <- paste(trimws(name, which = c("both", "left", "right")))
  name <- sub(" ","",name)
  }
  }
  #Markov-chain this later, this is too hacky https://towardsdatascience.com/generating-startup-names-with-markov-chains-2a33030a4ac0
  return(name)
}

#MAIN




for (object_count in 1:1000) #adjust this value for more objects. Not all will survive:
#it should generally be 4x what you expect to see on screen.
  {
     
      object_type <- rnorm(1, mean = 0, sd = 1)
      
      if (object_type < 0) {
        star <- stargenerator()
        starlog <- rbind(starlog, star)
      } else {
        planet <- planetgenerator()
        planetlog <- rbind(planetlog, planet)
        
      }
     
     object_count = object_count + 1
     
}
#linker

#link planets to stars
for (i in 1:nrow(planetlog)) {
  planetlog$target[i] <- as.character(starlog$name[sample(1:nrow(starlog), 1)])
  planetlog$value[i] <- rnorm(1, mean = 4, sd = 3) #this value is link strength, or in space, distance
  planetlog$source <- planetlog$name
}

#link stars to each other
for (i in 1:nrow(starlog)) {
  starlog$target[i] <- as.character(starlog$name[sample(1:nrow(starlog), 1)])
  starlog$value[i] <- as.integer(rnorm(1, mean = 4, sd = 3)) #this value is link strength, or in space, distance
  starlog$source <- starlog$name
}

#merge starlog and planetlog
log <- rbind(starlog,planetlog)
write.csv(log, "E://GalaxyGen//log.csv")

# Plot



p <- simpleNetwork(log, height="100px", width="100px",        
                   Source = 5,                 # column number of source
                   Target = 6,                 # column number of target
                   linkDistance = 5,          # distance between node. Increase this value to have more space between nodes
                   charge = -20,                # numeric value indicating either the strength of the node repulsion (negative value) or attraction (positive value)
                   fontSize = 14,               # size of the node names
                   fontFamily = "serif",       # font og node names
                   linkColour = "#666",        # colour of edges, MUST be a common colour for the whole graph
                   nodeColour = "#69b3a2",     # colour of nodes, MUST be a common colour for the whole graph
                   opacity = 0.9,              # opacity of nodes. 0=transparent. 1=no transparency
                   zoom = T                    # Can you zoom on the figure?
)
p

#prep for export to JS

library(jsonlite)
#nodes table
nodes <- log[c("name", "type", "class")]
for (i in 1:nrow(log)) {
nodes$group[i] = as.integer(rnorm(1, mean = 4, sd = 3))
colnames(nodes)[1] <- "id"
}

#edges table
links <- log[c("source", "target", "value")]

#turn to JSON
nodesJSON <- toJSON(nodes)
prettify(nodeJSON, indent = 4)
linksJSON <- toJSON(links)
prettify(linksJSON, indent = 4)
write(nodesJSON, "E://GalaxyGen//nodes.json")
write(nodesJSON, "E://GalaxyGen//links.json")
