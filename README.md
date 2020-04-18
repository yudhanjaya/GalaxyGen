# GalaxyGen

Simple galaxy generator. Designed for storytelling purposes, so instead of z,y and z positions in space it generates a graph of stars and planets. Written in R.

          V1 notes: Goes the long way round. Generates table of stars and planets from scratch, links planets to stars, 
          stars to other stars.
          Rudimentary visualization in /vis folder using the log.csv (I still need to add labels and 
          clean up the id field).
          Rudimentary name generator that chains two-letter words from Scrabble to form names.
          
          V2 goals: use R's igraph to do generation, swap out the name generator for a Markov-chain 
          based generator, and get /3Dvis working.
          
          V3 goals: generate descriptions for planets and artificial constructs.
          
          V4: add events.
